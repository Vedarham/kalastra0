import express from "express";
import { deleteProfile, switchToArtisan } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Delete user profile
router.delete("/delete", authMiddleware, deleteProfile);

// Switch profile from user → artisan
router.patch("/switch-artisan", authMiddleware, switchToArtisan);

export default router;
