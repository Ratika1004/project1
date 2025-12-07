const { Router } = require("express");
const registerRules = require("../middlewares/create-user-rules");
const loginRules = require("../middlewares/login-user-rules");
const verifyLoginRules = require("../middlewares/verify-login-rules");
const checkValidation = require("../../../shared/middlewares/check-validation");

const UserModel = require("../models/user-model");
const OTPModel = require("../models/otp-model");
const { matchPassword } = require("../../../shared/password-utils");
const { encodeToken } = require("../../../shared/jwt-utils");
const authorize = require("../../../shared/middlewares/authorize");
const { randomNumberOfDigits } = require("../../../shared/compute-utils");
const { sendEmail } = require("../../../shared/email-utils");

const usersRoute = Router();

usersRoute.post("/register", registerRules, checkValidation, async (req, res) => {
  try {
    const newUser = req.body;
    newUser.email = (newUser.email || "").trim().toLowerCase();

    const exists = await UserModel.findOne({ email: newUser.email });
    if (exists) return res.status(409).json({ message: "User with this email already exists" });

    const addedUser = await UserModel.create(newUser);
    const userSafe = addedUser.toObject();
    delete userSafe.password;

    res.status(201).json(userSafe);
  } catch (err) {
    console.error("register error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

usersRoute.post("/login", loginRules, checkValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();
    const foundUser = await UserModel.findOne({ email: normalizedEmail });
    if (!foundUser) return res.status(404).json({ errorMessage: "User with this email does not exist" });

    if (!matchPassword(password, foundUser.password)) {
      return res.status(401).json({ errorMessage: "Email and password do not match" });
    }

    const otp = randomNumberOfDigits(6).toString();
    await OTPModel.findOneAndUpdate(
      { account: foundUser._id },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    await sendEmail(normalizedEmail, "Your OTP for GroceryGo login", `Your OTP is ${otp}. It expires in 5 minutes.`);

    res.json({ message: "OTP sent to your email address" });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

usersRoute.post("/verify-login", verifyLoginRules, checkValidation, async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();

    const foundUser = await UserModel.findOne({ email: normalizedEmail });
    if (!foundUser) return res.status(404).json({ errorMessage: "User with this email does not exist" });

    const savedOTP = await OTPModel.findOne({ account: foundUser._id });
    if (!savedOTP || savedOTP.otp !== String(otp).trim()) {
      return res.status(401).json({ errorMessage: "Invalid OTP" });
    }

    const tokenPayload = {
      _id: foundUser._id.toString(),
      email: foundUser.email,
      roles: foundUser.roles,
      name: foundUser.name,
    };

    const token = encodeToken(tokenPayload);

    await OTPModel.deleteOne({ account: foundUser._id });

    const safeUser = foundUser.toObject();
    delete safeUser.password;

    return res.json({ message: "Login successful", user: safeUser, token });
  } catch (err) {
    console.error("verify login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

usersRoute.get("/", authorize(["admin"]), async (req, res) => {
  try {
    const allUsers = await UserModel.find().select("-password");
    res.json(allUsers || []);
  } catch (err) {
    console.error("get users error:", err);
    res.status(500).json({ errorMessage: "Error fetching users" });
  }
});

usersRoute.get("/accounts/:id", authorize(["admin", "customer"]), async (req, res) => {
  try {
    const userID = req.params.id;
    const requester = req.account;
    const isAdmin = requester.roles.includes("admin");

    if (!isAdmin && String(requester._id) !== String(userID)) {
      return res.status(403).json({ errorMessage: "You cannot access another user's account." });
    }

    const foundUser = await UserModel.findById(userID).select("-password");
    if (!foundUser) return res.status(404).json({ errorMessage: `User with ${userID} doesn't exist` });

    res.json(foundUser);
  } catch (err) {
    console.error("get account error:", err);
    res.status(500).json({ errorMessage: "Error fetching account" });
  }
});

usersRoute.put("/accounts/:id", authorize(["admin", "customer"]), async (req, res) => {
  try {
    const userID = req.params.id;
    const requester = req.account;
    const isAdmin = requester.roles.includes("admin");

    if (!isAdmin && String(requester._id) !== String(userID)) {
      return res.status(403).json({ errorMessage: "You cannot update another user's profile." });
    }

    const newUser = req.body;
    if (!newUser) return res.status(421).json({ errorMessage: "Nothing to update" });

    if (!isAdmin && newUser.roles) {
      return res.status(403).json({ errorMessage: "You cannot update your roles. Contact admin." });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userID, { $set: newUser }, { new: true }).select("-password");
    res.json(updatedUser);
  } catch (err) {
    console.error("update account error:", err);
    res.status(500).json({ errorMessage: "Error updating account" });
  }
});

usersRoute.delete("/accounts/:id", authorize(["admin"]), async (req, res) => {
  try {
    const userID = req.params.id;
    const deletedUser = await UserModel.findByIdAndDelete(userID).select("-password");
    if (!deletedUser) return res.status(404).json({ errorMessage: `User with ${userID} doesn't exist` });

    res.json(deletedUser);
  } catch (err) {
    console.error("delete account error:", err);
    res.status(500).json({ errorMessage: "Error deleting account" });
  }
});

module.exports = usersRoute;
