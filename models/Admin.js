const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, default: "admin" } // role is fixed
}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);
