const mongoose = require("mongoose");


const invoiceSchema = new mongoose.Schema(
{

    invoiceNumber:{
        type:String,
        unique:true,
        required:true
    },


    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order",
        required:true
    },
customer:{
    firstName:String,
    lastName:String,
    email:String,
    phone:String
},
company:{
    name:String,
    phone:String,
    address:String
},
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },


    products:[
        {
            name:String,
            quantity:Number,
            price:Number
        }
    ],


    total:{
        type:Number,
        required:true
    },


    status:{
        type:String,
        enum:[
            "created",
            "paid"
        ],
        default:"created"
    }


},
{
    timestamps:true
});


module.exports = mongoose.model("Invoice",invoiceSchema);