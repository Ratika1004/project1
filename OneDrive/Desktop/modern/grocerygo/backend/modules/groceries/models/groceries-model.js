
const mongoose = require("mongoose");

const grocerySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
    isBought: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Grocery", grocerySchema);
