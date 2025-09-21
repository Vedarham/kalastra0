import express from "express";
import { getArtisanProfile, updateArtisanProfile, getArtisanProducts } from "../controllers/artisanController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get artisan profile
router.get("/:id", getArtisanProfile);

// Update artisan profile
router.put("/update", authMiddleware, updateArtisanProfile);

// Get artisan's products
router.get("/:id/products", getArtisanProducts);

export default router;
