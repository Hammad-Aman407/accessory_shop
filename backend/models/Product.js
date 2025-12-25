const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true
  },
  category:{
    type:String,
    required:true
  },
  costPrice: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
  }
}, { timestamps: true });  

module.exports = mongoose.model("Product", productSchema);