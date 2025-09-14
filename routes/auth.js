const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Register (store plain password)
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const newUser = new User({
      username,
      email,
      password, // stored as plain text
      phone,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login (compare plain password)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password }); // direct compare
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    res.json({ message: "Login successful", user: { username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
