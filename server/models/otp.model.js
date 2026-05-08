import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  otp: String,
  expiresAt: Date,
});

export default mongoose.model("OTP", otpSchema);