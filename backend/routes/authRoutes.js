const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const nodemailer = require("nodemailer");


const SECRET_KEY = "mysecretkey";

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword
  });

  await user.save();

  res.json({ message: "User registered successfully" });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id }, SECRET_KEY, {
    expiresIn: "1d"
  });

  res.json({
  message: "Login successful",
  token: token,
  user: {
    name: user.name,
    email: user.email,
    phone: user.phone,
    username: user.username
  }
});
});

//GET PROFILE
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization;

    const decoded = jwt.verify(token, 'secret');
    const user = await User.findById(decoded.id);

    res.json(user);

  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization;

    const decoded = jwt.verify(token, 'secret');

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      req.body,
      { new: true }
    );

    res.json(updatedUser);

  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

//SEND OTP API

router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 300000; // 5 mins

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "YOUR_EMAIL@gmail.com",
        pass: "YOUR_APP_PASSWORD"
      }
    });

    await transporter.sendMail({
      to: email,
      subject: "Your OTP Code",
      html: `<h3>Your OTP is: ${otp}</h3>`
    });

    res.json({ message: "OTP sent to email" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// VERIFY OTP API
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  res.json({ message: "OTP verified" });
});

// RESET PASSWORD API
router.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  user.password = password;
  user.otp = null;
  user.otpExpiry = null;

  await user.save();

  res.json({ message: "Password reset successful" });
});

// GOOGLE LOGIN
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// CALLBACK
router.get("/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {

    const token = jwt.sign(
      { id: req.user._id },
      "secret",
      { expiresIn: "1d" }
    );

    res.redirect(`http://localhost:4200/home?token=${token}`);
  }
);

module.exports = router;