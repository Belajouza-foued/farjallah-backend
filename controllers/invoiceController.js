const Invoice = require("../models/Invoice");
const Order = require("../models/Order");
const User = require("../models/User");
const generateInvoicePDF = require("../utils/generateInvoicePDF");


// CREATE INVOICE

const createInvoice = async (req, res) => {

  try {

    const order = await Order.findById(req.params.orderId);

    if(!order){
      return res.status(404).json({
        success:false,
        message:"Commande introuvable"
      });
    }


    const user = await User.findById(order.user);


    if(!user){
      return res.status(404).json({
        success:false,
        message:"Client introuvable"
      });
    }


    const invoiceNumber = "FAC-" + Date.now();


    const invoice = await Invoice.create({

      invoiceNumber,

      order: order._id,

      user: order.user,

      customer:{
        firstName:user.firstName,
        lastName:user.lastName,
        email:user.email,
        phone:user.phone
      },


      products:order.products.map(item=>({
        name:item.name,
        quantity:item.quantity,
        price:item.price
      })),

      total:order.total

    });


    res.status(201).json({
      success:true,
      message:"Facture créée",
      invoice
    });


  } catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};



// =======================
// GET INVOICE PDF
// =======================

const getInvoicePDF = async (req,res)=>{

  try {

    const invoice = await Invoice.findById(req.params.id);


    if(!invoice){

      return res.status(404).json({
        success:false,
        message:"Facture introuvable"
      });

    }


    generateInvoicePDF(invoice,res);


  } catch(error){

    console.log("PDF ERROR :",error);


    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};



// EXPORT

module.exports = {
  createInvoice,
  getInvoicePDF
};