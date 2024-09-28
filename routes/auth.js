const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/user");
const requireAuth = require("../middlewares/requireAuth");

// Error handler middleware
const errorHandler = (res, error) => {
  console.error(error);
  res.status(500).json({ error: "Internal Server Error" });
};

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username is already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
    });
    await newUser.save();

    res.json({ message: "User created" });
  } catch (error) {
    errorHandler(res, error);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      {
        user: user._id,
      },
      process.env.JWT_SECRET,
    );

    res.json({
      success: true,
      token: `Bearer ${token}`,
      userId: user._id,
      username: user.username,
    });
  } catch (error) {
    errorHandler(res, error);
  }
});

// logout
router.post("/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

router.get("/validate", requireAuth, async (req, res) => {
  try {
    res.status(200).json({ message: "Token is valid", user: req.user });
  } catch (error) {
    errorHandler(res, error);
  }
});

module.exports = router;
