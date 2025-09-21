import mongoose from "mongoose";

const artisanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // link to generic user profile
      required: true,
    },
    shopName: { type: String, required: true },
    category: {
      type: String,
      enum: ["pottery", "textiles", "jewelry", "painting", "other"],
      required: true,
    },
    bio: { type: String, maxlength: 500 },
    profileImage: { type: String }, // GCS URL
    socialLinks: {
      instagram: String,
      facebook: String,
      website: String,
    },
    rating: {
      avg: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    isVerified: { type: Boolean, default: false }, // optional moderation
  },
  { timestamps: true }
);

export default mongoose.model("Artisan", artisanSchema);
