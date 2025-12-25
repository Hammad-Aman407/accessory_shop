require("dotenv").config(); 
const express = require("express");
const serverless = require("serverless-http");
const connectDB = require("../db");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const adminRoutes = require("./adminRoutes");
const productRoutes = require("./productRoutes");
const saleRoutes = require("./saleRoutes");
const reportRoutes = require("./reportRoutes");
const auth = require("../authMiddleware");

connectDB();

app.get("/", (req, res) => {
  res.json({ message: "API working" });
});

app.use("/admin", adminRoutes);
app.use("/products", productRoutes);
app.use("/sales", auth, saleRoutes);
app.use("/reports", auth, reportRoutes);

module.exports = serverless(app);