const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product",                        
  },
  name: {
    type: String,
    required: true,
  },
  category:{
    type:String,
    required:true
  },
  costPrice: {
    type: Number,
    required: true
  },
  quantitySold: {
    type: Number,
    required: true
  },
  sellingPrice: {          
    type: Number,
    required: true
  },
  profit: {                
    type: Number
  },
  saleDate: {
    type: Date,
    default: Date.now      
  }
}, { timestamps: true });  

module.exports = mongoose.model("Sale", saleSchema);
