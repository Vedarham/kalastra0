import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true }, // Link with Firebase
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ["artisan", "user"], default: "user" },
  bio: { type: String },
  profilePic: { type: String }, // GCS URL
  location: {
    lat: Number,
    lng: Number,
    address: String,
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);