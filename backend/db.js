const mongoose = require("mongoose");

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    mongoose.connection.on("error", (err) => {
      console.log("MongoDB error:", err);
    });

  } catch (error) {
    console.error("Initial MongoDB connection failed", error);
    process.exit(1);
  }
};

module.exports = connectDB;
