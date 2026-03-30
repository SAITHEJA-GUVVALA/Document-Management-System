const express = require("express");
const app = express();   // ✅ FIRST create app

const mongoose = require("mongoose");
const cors = require("cors");

const passport = require("passport");
const session = require("express-session");
require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const docRoutes = require("./routes/documentRoutes");

require('dotenv').config();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ✅ SESSION AFTER app created
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// STATIC FILES
app.use("/uploads", express.static("uploads"));

// ROUTES
app.use("/api/docs", docRoutes);
app.use("/api/auth", authRoutes);

// DATABASE
mongoose.connect("mongodb://127.0.0.1:27017/dms")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// SERVER
app.listen(5000, () => console.log("Server running on port 5000"));