
const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    groceries: { type: Array, default: [] },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Group", groupSchema);
