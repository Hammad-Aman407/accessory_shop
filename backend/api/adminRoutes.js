const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const router = express.Router();

// router.post("/register", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const existing = await Admin.findOne({ username });
//     if (existing) {
//       return res.status(400).json({ message: "Admin already exists" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const admin = new Admin({
//       username,
//       password: hashedPassword
//     });

//     await admin.save();
//     res.json({ message: "Admin created successfully" });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });


router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
