import express from "express";
import { createOrder, getMyOrders, getOrderById, cancelOrder, getSellerOrders, updateItemStatus, getSellerStats, } from "../controllers/orderController.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Create order
router.post("/", authMiddleware, createOrder);

// Get logged-in user's orders
router.get("/my", authMiddleware, getMyOrders);

// Get single order
router.get("/:id", authMiddleware, getOrderById);

// Cancel order (buyer only)
router.put("/:id/cancel", authMiddleware, cancelOrder);

// Get seller-specific orders
router.get("/seller/all", authMiddleware, authorizeRoles('seller'),  getSellerOrders);

// Update item status inside order
router.put("/seller/:orderId/item/:itemId", authMiddleware, authorizeRoles('seller'),  updateItemStatus);

// Seller dashboard stats
router.get("/seller/stats", authMiddleware, authorizeRoles('seller'),  getSellerStats);

export default router;