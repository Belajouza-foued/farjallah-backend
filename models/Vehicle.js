const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
{
    brand:{
        type:String,
        required:true,
        trim:true
    },

    model:{
        type:String,
        required:true,
        trim:true
    },

    year:{
        type:Number,
        required:true
    },

    engine:{
        type:String,
        required:true,
        trim:true
    },
     fuel: {
    type: String,
    enum: ["Essence", "Diesel", "Hybride", "Électrique"],
  }
},
{
    timestamps:true
});

module.exports = mongoose.model("Vehicle",vehicleSchema);