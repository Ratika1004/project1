const mongoose = require("mongoose");

const DB_URL = process.env.DB_URL;

async function connectDB(req, res, next) {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  try {
    await mongoose.connect(DB_URL, {
      dbName: "groceries"
    });

    console.log("Connected to MongoDB successfully");
    next();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res
      .status(500)
      .json({ message: "Database connection failed", error: error.message });
  }
}

module.exports = connectDB;
