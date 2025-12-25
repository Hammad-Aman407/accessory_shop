const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.post("/add", async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ message: "Product added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error adding product" });
    }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new: true,    
        runValidators: true 
      });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({message: "Product updated successfully" });

  } catch (error) {
    res.status(500).json({message: "Error updating product" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;