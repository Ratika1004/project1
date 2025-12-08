const mongoose = require("mongoose");
const { encodePassword } = require("../../../shared/password-utils");


const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    address: { type: String },
    roles: { type: [String], enum: ["admin", "customer"], default: ["customer"], required: true },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }], 
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await encodePassword(this.password);
});


const UserModel = mongoose.model("User", userSchema);

const getUserByID = async (id) => {
  if (!id) return null;
  try {
    return await UserModel.findById(id);
  } catch (err) {
    return null;
  }
};

UserModel.getUserByID = getUserByID;
module.exports = UserModel;

