const Order = require("../models/Order");
const Cart = require("../models/Cart");


// =======================
// CREATE ORDER FROM CART
// =======================
const createOrder = async (req, res) => {

  try {

    const cart = await Cart.findOne({ user: req.user._id })
      .populate("products.product");


    if (!cart || cart.products.length === 0) {

      return res.status(400).json({
        success:false,
        message:"Cart is empty"
      });

    }


    let total = 0;


    // Vérifier produits + stock + calcul total
    for (const item of cart.products) {


      if (!item.product) {

        return res.status(404).json({
          success:false,
          message:"Produit introuvable"
        });

      }


      if(item.product.stock < item.quantity){

        return res.status(400).json({

          success:false,

          message:`${item.product.name} : stock insuffisant`

        });

      }


      total += item.product.price * item.quantity;

    }



    // Générer numéro bon de commande

    const orderNumber = 
      "BC-" + Date.now();



    // Diminuer stock

    for (const item of cart.products) {

      item.product.stock -= item.quantity;

      await item.product.save();

    }



    // Créer commande

    const order = await Order.create({

      orderNumber,

      user:req.user._id,


      products:cart.products.map(item=>({

        product:item.product._id,

        name:item.product.name,

        quantity:item.quantity,

        price:item.product.price

      })),


      total,

    });



    // vider panier

    cart.products = [];

    await cart.save();



    res.status(201).json({

      success:true,

      message:"Commande créée",

      order

    });



  } catch(error){


    console.log("ORDER ERROR :",error);


    res.status(500).json({

      success:false,

      message:error.message

    });


  }

};




// =======================
// GET USER ORDERS
// =======================

const getMyOrders = async(req,res)=>{


  try {


    const orders = await Order.find({

      user:req.user._id

    })
    .sort({
      createdAt:-1
    });



    res.status(200).json({

      success:true,

      orders

    });



  }catch(error){


    res.status(500).json({

      success:false,

      message:error.message

    });


  }


};



module.exports = {

  createOrder,

  getMyOrders

};