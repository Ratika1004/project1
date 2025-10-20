const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserByID,
  addNewUser,
  getUserByEmail,
} = require("../models/user-model");

const { createUserRules, validateCreateUser } = require("../middlewares/create-user-rules");
const { loginUserRules, validateLoginUser } = require("../middlewares/login-user-rules");

// ✅ Get all users
router.get("/users", async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// ✅ Get user by ID
router.get("/users/:id", async (req, res, next) => {
  try {
    const user = await getUserByID(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// ✅ Get user by email (optional helper)
router.get("/users/email/:email", async (req, res, next) => {
  try {
    const user = await getUserByEmail(req.params.email);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// ✅ Register a new user
router.post("/users", createUserRules, validateCreateUser, async (req, res, next) => {
  try {
    const newUser = await addNewUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// ✅ Login route (just validation for now)
router.post("/users/login", loginUserRules, validateLoginUser, async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ message: "Invalid email" });
    res.json({ message: "Login successful", user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
