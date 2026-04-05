import mongoose from "mongoose";

const artisanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    shopName: {
      type: String,
      trim: true
    },
    shopDescription: {
      type: String,
      maxlength: [1000, 'Shop description cannot be more than 1000 characters']
    },
    shopBanner: String,
    socialLinks: {
      website: String,
      instagram: String,
      facebook: String,
      twitter: String
    },
    
    products: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Product" 
    }],   

    category: {
      type: String,
      enum: ["pottery", "textiles", "jewelry", "painting", "other"],
      required: true,
    },

    totalSales: {
      type: Number,
      default: 0
    },
    
    numReviews: {
      type: Number,
      default: 0
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    isEmailVerified: {
      type: Boolean,
      default: false
    },

    isSellerVerified: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

export default mongoose.model("Artisan", artisanSchema);
