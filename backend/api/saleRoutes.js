const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const Product = require("../models/Product");
const cron = require("node-cron");

router.post("/add", async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.body.quantitySold > product.quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    if (req.body.sellingPrice <= product.costPrice) {
      return res.status(400).json({ message: "Selling price cannot be less than cost price" });
    }

    req.body.profit = (req.body.sellingPrice - product.costPrice) * req.body.quantitySold;

    const saleData = {
      product: product._id,
      name: product.name,
      category: product.category,
      costPrice: product.costPrice,
      quantitySold: req.body.quantitySold,
      sellingPrice: req.body.sellingPrice,
      profit: req.body.profit
    };

    const sale = new Sale(saleData);
    await sale.save();

    product.quantity -= req.body.quantitySold;
    if (product.quantity <= 0) {
      await Product.findByIdAndDelete(product._id);
    } else {
      await product.save();
    }

    res.status(201).json({
      message: "Sale recorded successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error recording sale" });
  }
});

router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales" });
  }
});

cron.schedule("0 0 1 * *", async () => { 
  try {
    await Sale.deleteMany({});

    console.log("Monthly reset: sale records deleted");
  } catch (error) {
    console.error("Error during monthly reset");
  }
});


module.exports = router;