// backend/models/Song.js
const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    singer: { type: String, required: true },
    album: { type: String },
    duration: { type: String },
    year: { type: Number },
    language: { type: String },
    url: { type: String, required: true }, // mp3 link
  },
  { timestamps: true }
);

module.exports = mongoose.model("Song", songSchema);
