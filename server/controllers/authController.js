import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.utils.js";
import OTP from "../models/otp.model.js";
import { generateOTP, hashOTP } from "../utils/generateOTP.utils.js";

export const registerUser = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    email = email.toLowerCase().trim();
  
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }
  
    const allowedRoles = ["buyer", "seller"];
    const safeRole = allowedRoles.includes(role) ? role : "buyer";
  
    const user = await User.create({
      name,
      email,
      password,
      role: safeRole
    });
  
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
  
    user.refreshTokens.push({ token: refreshToken, createdAt: new Date() });
    await user.save();
  
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
  
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar
          },
      accessToken
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

export const loginUser = async (req, res) => {
  try {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  email = email.toLowerCase().trim();

  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  if (!user.refreshTokens) user.refreshTokens = [];
  user.refreshTokens.push({ token: refreshToken, createdAt: new Date() });
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    success: true,
    message: 'Login successful',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    },
    accessToken
  });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

export const googleCallback = async (req, res) => {
  try {
    
    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);

    if (!req.user.refreshTokens) req.user.refreshTokens = [];
    req.user.refreshTokens.push({ token: refreshToken, createdAt: new Date() });
    await req.user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${accessToken}`);
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error during Google login',
      error: error.message });
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.status(200).json({ 
      success: true,
      user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      bio: user.bio,
      location: user.location
    }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error.message
    });
  }
};

export const updateProfile =async(req,res)=>{
  try {
    const {name, email, phone, avatar, bio, location} = req.body;

    const user = await User.findById(req.user.id);;
    if(!user){
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    if (name) user.name = name;
    if (email) user.email = email.toLowerCase().trim();
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;

    if (location) {
      user.location = {
        city: location.city || user.location?.city,
        state: location.state || user.location?.state,
        country: location.country || user.location?.country,
      };
    }

    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        bio: user.bio,
        location: user.location
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No refresh token"
      });
    }
    
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    const tokenExists = user.refreshTokens.find(t => t.token === token);

    if (!tokenExists) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token"
      });
    }

    user.refreshTokens = user.refreshTokens.filter(t => t.token !== token);

    const newRefreshToken = generateRefreshToken(user);
    const newAccessToken = generateAccessToken(user);

    user.refreshTokens.push({
      token: newRefreshToken,
      createdAt: new Date()
    });

    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      accessToken: newAccessToken
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token"
    });
  }
};

export const sendVerificationOtp = async (req, res) => {
  try {
    const userId = req.user.id;
    const existing = await OTP.findOne({ userId });

    if (existing && existing.expiresAt > Date.now()) {
      return res.status(429).json({
        success: false,
        message: "Wait before requesting new OTP",
      });
    }

    const otp = generateOTP();
    const hashedOtp = hashOTP(otp);

    // ♻️ Upsert (one OTP per user)
    await OTP.findOneAndUpdate(
      { userId },
      {
        otp: hashedOtp,
        expiresAt: Date.now() + 5 * 60 * 1000,
        attempts: 0,
      },
      { upsert: true, new: true }
    );
    console.log("OTP (dev):", otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otp } = req.body;

    const record = await OTP.findOne({ userId });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "No OTP found",
      });
    }

    if (record.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (record.attempts >= 5) {
      return res.status(429).json({
        success: false,
        message: "Too many attempts",
      });
    }

    const hashedOtp = hashOTP(otp);

    if (hashedOtp !== record.otp) {
      record.attempts += 1;
      await record.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    const user = await User.findById(userId);

    user.isSellerVerified = true;
    await user.save();

    await OTP.deleteOne({ userId });

    return res.status(200).json({
      success: true,
      message: "Verification successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isSellerVerified: user.isSellerVerified,
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.json({ success: true, message: "Logged out" });
  }
  
  await User.updateOne(
    { "refreshTokens.token": token },
    { $pull: { refreshTokens: { token } } }
  );

  res.clearCookie("refreshToken");

  res.json({
    success: true,
    message: 'Logged out successfully'
  });

};