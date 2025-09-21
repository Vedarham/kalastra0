import express from "express";
import { addToCart, removeFromCart, getCartItems } from "../controllers/cartController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Add product to cart
router.post("/add", authMiddleware, addToCart);

// Remove product from cart
router.delete("/remove/:productId", authMiddleware, removeFromCart);

// Get all items in user's cart
router.get("/", authMiddleware, getCartItems);

export default router;
