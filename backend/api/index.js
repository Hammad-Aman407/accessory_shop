require("dotenv").config();
const express = require("express");
const connectDB = require("../db");
const cors = require("cors");

const app = express();

const allowedOrigins = process.env.BASE_URL

const corsOptions = {
  origin: function (origin, callback) {
  
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
};

app.use(cors(corsOptions));
app.use(express.json());

const adminRoutes = require("./adminRoutes");
const productRoutes = require("./productRoutes");
const saleRoutes = require("./saleRoutes");
const reportRoutes = require("./reportRoutes");
const auth = require("./authMiddleware");

connectDB();

app.get("/", (req, res) => {
  res.json({ message: "API working" });
});

app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", auth, saleRoutes);
app.use("/api/reports", auth, reportRoutes);

module.exports = app; 