const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Product = require("../models/Product");

// =======================
// CREATE PAYMENT
// =======================
const createPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    // check orderId
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "orderId is required",
      });
    }

    // find order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // security: check owner
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to pay this order",
      });
    }

    // create stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // cents safe
      currency: "usd",
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
    });

    // create payment record
    const payment = await Payment.create({
      user: req.user._id,
      order: order._id,
      amount: order.total,
      transactionId: paymentIntent.id,
      paymentStatus: "pending",
    });

    res.status(201).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      payment,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =======================
// CONFIRM PAYMENT
// =======================
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: "paymentIntentId is required",
      });
    }

    // 🔍 vérifier paiement chez Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    // 🔍 trouver payment en DB
    const payment = await Payment.findOne({
      transactionId: paymentIntentId,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // 💳 update payment
    payment.paymentStatus = "paid";
    await payment.save();

    // 📦 update order
    await Order.findByIdAndUpdate(payment.order, {
      paymentStatus: "paid",
      status: "paid",
    });
// 📦 récupérer la commande
const order = await Order.findById(payment.order)
    .populate("products.product");

// 📉 diminuer le stock
for (const item of order.products) {

    const product = await Product.findById(item.product._id);

    if (!product) continue;

    product.stock -= item.quantity;

    if (product.stock < 0) {
        product.stock = 0;
    }

    await product.save();
}
    res.status(200).json({
      success: true,
      message: "Payment confirmed successfully",
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/*stock*/



module.exports = { createPayment,
     confirmPayment,
 };