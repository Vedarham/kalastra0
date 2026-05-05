import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email'],
    index: true
  },
  googleId: {
      type: String,
      index: true,
      sparse: true,
    },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },

  refreshTokens: [
    {
      token: String,
      createdAt: Date
    }
  ],

  role: {
    type: String,
    enum: ['buyer', 'seller', 'admin'],
    default: 'buyer',
    index: true,
  },
  avatar: {
    type: String,
    default: "https://api.dicebear.com/7.x/initials/svg?seed=User"
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  location: {
    city: String,
    state: String,
    country: String
  },
  phone: {
  type: String,
  match: [/^\+?[0-9]{7,15}$/, "Invalid phone number"]
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  
  // Seller-specific fields
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
    },
  
  // Verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isSellerVerified: {
    type: Boolean,
    default: false
  },
  
  // Stats
  totalSales: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  // emailVerificationToken: String,
  // emailVerificationExpire: Date,
  
  isActive: {
    type: Boolean,
    default: true
  }
  
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// // Generate verification token for email verification
// userSchema.methods.generateVerificationToken = function() {
//   const token = Math.random().toString(36).substring(2, 15) + 
//                 Math.random().toString(36).substring(2, 15);
//   this.emailVerificationToken = token;
//   this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
//   return token;
// };

export default mongoose.model("User", userSchema);