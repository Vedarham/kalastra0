import express from "express";
import {
  registerUser,
  loginUser,
  googleCallback,
  getMe,
  logoutUser,
  refreshAccessToken,
  sendVerificationOtp,
  verifyOtp,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import passport from "passport";

const router = express.Router();

// Register new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Google OAuth login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  googleCallback
);

// Get current user profile
router.get("/me", authMiddleware, getMe);

// Refresh Token
router.post("/refresh", refreshAccessToken);

// OTP — seller verification
router.post("/send-otp", authMiddleware, sendVerificationOtp);
router.post("/verify-otp", authMiddleware, verifyOtp);

// Logout user
router.post("/logout", authMiddleware, logoutUser);

export default router;
