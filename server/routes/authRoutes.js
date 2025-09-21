import express from "express";
import { registerUser, loginUser, logoutUser,getMe } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Register new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get current user profile
router.get("/me", authMiddleware, getMe);

// Logout user
router.post("/logout", logoutUser);

// Refresh JWT access token
// router.post("/refresh", refreshToken);

export default router;
