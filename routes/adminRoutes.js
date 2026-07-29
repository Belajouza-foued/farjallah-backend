const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");

const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const Invoice = require("../models/Invoice");


// =======================
// GET ALL PRODUCTS
// =======================
router.get("/products", protect, adminOnly, async (req,res)=>{

    try {

        const products = await Product.find()
            .populate("category", "name");


        res.json(products);


    } catch(err) {

        res.status(500).json({
            message: err.message
        });

    }

});
// invoices//
// =======================
// GET ALL INVOICES
// =======================

router.get("/invoices", protect, adminOnly, async(req,res)=>{

  try{

    const invoices = await Invoice.find()
      .sort({createdAt:-1});


    console.log("TOTAL FACTURES :", invoices.length);

    invoices.forEach(inv=>{
        console.log(
          inv.invoiceNumber,
          inv.customer?.firstName,
          inv.user,
          inv.createdAt
        );
    });


    res.json({
      success:true,
      invoices
    });


  }catch(error){

    console.log(error);

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

});

// =======================
// GET ALL ORDERS
// =======================
router.get("/orders", protect, adminOnly, async (req, res) => {
    const orders = await Order.find()
       .populate("user", "email name")
         .populate("products.product", "name images price")
        .sort({ createdAt: -1 });

    res.json(orders);
});
router.get("/orders/:id", protect, adminOnly, async (req, res) => {

    const order = await Order.findById(req.params.id)
        .populate("user", "name email")
        .populate("products.product", "name price images");

    if (!order) {
        return res.status(404).json({
            message: "Commande introuvable"
        });
    }

    res.json(order);

});
// =======================
// UPDATE ORDER STATUS
// =======================
router.put("/orders/:id", protect, adminOnly, async (req, res) => {

    try {

        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Commande introuvable"
            });
        }


        order.status = status;

        await order.save();


        res.json({
            success: true,
            message: "Statut modifié",
            order
        });


    } catch(err){

        res.status(500).json({
            message: err.message
        });

    }

});


// =======================
// GET ALL USERS
// =======================
router.get("/users", protect, adminOnly, async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);
});
// GET STOCK
router.get("/stock", protect, adminOnly, async (req,res)=>{

    const products = await Product.find()
        .select("name stock images sku");

    res.json(products);

});
// GET STOCK PRODUCT DETAIL
// =======================
router.get("/stock/:id", protect, adminOnly, async(req,res)=>{

    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(404).json({
            message:"Produit introuvable"
        });
    }

    res.json(product);

});
// =======================
// UPDATE STOCK
// =======================
router.put("/stock/:id", protect, adminOnly, async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Produit introuvable"
            });
        }

        product.stock = Number(req.body.stock);

        await product.save();

        res.json({
            success: true,
            message: "Stock mis à jour",
            product
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});
// =======================
// DASHBOARD STATS
// =======================
router.get("/dashboard", protect, adminOnly, async (req, res) => {

    try {

        const totalProducts = await Product.countDocuments();

        const totalOrders = await Order.countDocuments();

        const totalUsers = await User.countDocuments({
            role: "customer"
        });

        const outOfStock = await Product.countDocuments({
            stock: 0
        });

        const lowStock = await Product.countDocuments({
            stock: { $lt: 5, $gt: 0 }
        });

        const revenue = await Order.aggregate([
            {
                $match: {
                    paymentStatus: "paid"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$total"
                    }
                }
            }
        ]);

        res.json({
            totalProducts,
            totalOrders,
            totalUsers,
            outOfStock,
            lowStock,
            revenue: revenue.length ? revenue[0].totalRevenue : 0
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});
// =======================
// SALES CHART
// =======================
router.get("/sales-chart", protect, adminOnly, async (req, res) => {

    try {

        const sales = await Order.aggregate([

            {
                $match: {
                    paymentStatus: "paid"
                }
            },

            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" }
                    },
                    totalSales: {
                        $sum: "$total"
                    },
                    totalOrders: {
                        $sum: 1
                    }
                }
            },

            {
                $sort: {
                    "_id.month": 1
                }
            }

        ]);

        res.json(sales);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});
router.get("/best-products", protect, adminOnly, async(req,res)=>{

try{


const products = await Order.aggregate([

{
$unwind:"$products"
},

{
$group:{
_id:"$products.product",
totalSold:{
$sum:"$products.quantity"
}
}
},

{
$sort:{
totalSold:-1
}
},

{
$limit:5
},

{
$lookup:{
from:"products",
localField:"_id",
foreignField:"_id",
as:"product"
}
}


]);


res.json(products);


}catch(err){

res.status(500).json({
message:err.message
});

}

});
router.get("/latest-orders", protect, adminOnly, async(req,res)=>{


const orders = await Order.find()

.populate("user","name email")

.sort({
createdAt:-1
})

.limit(5);
res.json(orders);
});

router.get("/stock-alerts", protect, adminOnly, async(req,res)=>{
const products = await Product.find({
stock:{
$lte:5
}

})
.select("name stock");
res.json(products);
});

module.exports = router;