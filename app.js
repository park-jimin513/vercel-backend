const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("Backend running on Vercel 🚀");
});

// Example protected route
app.get("/api/data", (req, res) => {
  res.json({ message: "This is data from backend API" });
});

// Export the app (⚠️ no app.listen for Vercel)
module.exports = app;
