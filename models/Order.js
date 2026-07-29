const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
     orderNumber:{
        type:String,
        unique:true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
       customer:{
        name:String,
        phone:String,
        address:String
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name:String,

            quantity:{
                type:Number,
                required:true
            },

            price:{
                type:Number,
                required:true
            }
        }
    ],

    total: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
     enum: [
  "pending",
  "confirmed",
  "paid",
  "shipped",
  "delivered",
  "cancelled"
],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);