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
        success: false,
        message: "Cart is empty",
      });
    }


    let total = 0;


    // Vérifier stock + calcul total
    for (const item of cart.products) {

      if (!item.product) {
        return res.status(404).json({
          success: false,
          message: "Produit introuvable",
        });
      }


      if (item.product.stock < item.quantity) {

        return res.status(400).json({
          success:false,
          message:`${item.product.name} : stock insuffisant`
        });

      }


      total += item.product.price * item.quantity;

    }



    // Diminuer le stock
    for (const item of cart.products) {

      item.product.stock -= item.quantity;

      await item.product.save();

    }



    // Créer commande
    const order = await Order.create({

      user: req.user._id,

      products: cart.products,

      total,

    });



    // Vider panier
    cart.products = [];

    await cart.save();



    res.status(201).json({

      success:true,

      message:"Commande créée",

      order

    });



  } catch(error){

    console.log("ORDER ERROR :", error);

    res.status(500).json({

      success:false,

      message:error.message

    });

  }
};

// =======================
// GET USER ORDERS
// =======================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
};