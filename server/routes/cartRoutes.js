import express from "express";
import { addToCart, removeFromCart, getCart, updateCartQuantity, clearCart } from "../controllers/cartController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Add product to cart
router.post("/add", authMiddleware, addToCart);

// Remove product from cart
router.post("/remove", authMiddleware, removeFromCart);

// Get all items in user's cart
router.get("/", authMiddleware, getCart);

// Update product quantity in cart
router.post("/update", authMiddleware, updateCartQuantity);

// Clear user's cart
router.post("/clear", authMiddleware, clearCart);

export default router;
