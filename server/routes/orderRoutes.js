import express from "express";
import { createOrder, getUserOrders, getOrderById, cancelOrder } from "../controllers/orderController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create a new order (checkout)
router.post("/", authMiddleware, createOrder);

// Get all orders for logged-in user
router.get("/", authMiddleware, getUserOrders);

// Get specific order details
router.get("/:orderId", authMiddleware, getOrderById);

// Cancel an order
router.delete("/:orderId", authMiddleware, cancelOrder);

export default router;
