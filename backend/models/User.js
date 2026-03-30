const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  otp: String,
  username: String,
  otpExpiry: Date,
  role: { type: String, default: "user" }
});

module.exports = mongoose.model("User", userSchema);