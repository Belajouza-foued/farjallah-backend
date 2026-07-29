const mongoose = require("mongoose");

const deliveryNoteSchema = new mongoose.Schema(
{
    deliveryNumber:{
        type:String,
        required:true,
        unique:true
    },

    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order",
        required:true
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    customer:{
        firstName:String,
        lastName:String,
        email:String,
        phone:String,
        address:String
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
            "prepared",
            "shipped",
            "delivered"
        ],
        default:"prepared"
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("DeliveryNote", deliveryNoteSchema);