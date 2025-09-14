// backend/routes/admin.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { getAudioDurationInSeconds } = require("get-audio-duration");

const Admin = require("../models/Admin");
const Song = require("../models/Song");
const User = require("../models/User");

const router = express.Router();

// ---------------- Ensure uploads folder exists ----------------
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// ---------------- Multer Setup ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique name
  },
});
const upload = multer({ storage });

// ---------------- Admin Register ----------------
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    const newAdmin = new Admin({ username, email, password, phone });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error("Admin Register Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- Admin Login ----------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email, password });

    if (!admin) return res.status(400).json({ message: "Invalid email or password" });

    res.json({
      message: "Login successful",
      admin: { username: admin.username, email: admin.email },
    });
  } catch (err) {
    console.error("Admin Login Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- Add Song (Upload) ----------------
router.post("/songs", upload.single("file"), async (req, res) => {
  try {
    const { title, singer, album, year, language } = req.body;

    if (!title || !singer || !req.file) {
      return res.status(400).json({ message: "Title, Singer, and File are required" });
    }

    const filePath = path.join(uploadsDir, req.file.filename);
    const durationSec = await getAudioDurationInSeconds(filePath).catch(() => 0);
    const duration = durationSec
      ? `${Math.floor(durationSec / 60)}:${String(Math.floor(durationSec % 60)).padStart(2, "0")}`
      : "0:00";

    const newSong = new Song({
      title,
      singer,
      album,
      duration,
      year,
      language,
      url: `/uploads/${req.file.filename}`, // save file path
    });

    await newSong.save();

    res.status(201).json({ message: "Song uploaded successfully", song: newSong });
  } catch (err) {
    console.error("Add Song Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- Get All Songs ----------------
router.get("/songs", async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (err) {
    console.error("Fetch Songs Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- Delete Song ----------------
router.delete("/songs/:id", async (req, res) => {
  try {
    await Song.findByIdAndDelete(req.params.id);
    res.json({ message: "Song deleted successfully" });
  } catch (err) {
    console.error("Delete Song Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- Get All Users ----------------
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- Delete User ----------------
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
