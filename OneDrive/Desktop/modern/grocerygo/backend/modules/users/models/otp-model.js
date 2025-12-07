const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
    account : { type: mongoose.Schema.Types.ObjectId, ref : "User" , required: true , unique: true },
    otp : { type: String ,  required: true},
    createdAt : {type : Date , default:Date.now , expires: 300}
});

const OTPModel = mongoose.model("OTP", OTPSchema);
module.exports = OTPModel;