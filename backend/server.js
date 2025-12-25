const express = require("express");
const connectDB = require("./db");
const cors = require("cors");
const app = express();
app.use(cors());
require("dotenv").config();

const adminRoutes = require("./api/adminRoutes");
const productRoutes = require("./api/productRoutes");
const saleRoutes = require("./api/saleRoutes");
const reportRoutes = require("./api/reportRoutes");

const auth = require("./api/authMiddleware");

const bodyParser = require('body-parser');
app.use(bodyParser.json());

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/admin", adminRoutes);
app.use("/api/products", auth, productRoutes);
app.use("/api/sales", auth, saleRoutes);
app.use("/api/reports", auth, reportRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});