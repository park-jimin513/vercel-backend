// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import Routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(cors());

// ✅ Serve uploaded files (audio)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------- ROUTES ----------------
app.use("/api/auth", authRoutes);   // User Auth Routes
app.use("/api/admin", adminRoutes); // Admin Routes

// Root check route
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// ---------------- DATABASE CONNECTION ----------------
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
})();

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
