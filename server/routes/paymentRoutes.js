import express from "express";
import { createPayment, stripeWebhook, razorpayWebhook, cancelOrder } from "../controllers/paymentController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Webhooks
router.post("/stripe/webhook",  express.raw({ type: "application/json" }), stripeWebhook);
router.post("/razorpay/webhook", express.json(), razorpayWebhook);

// Authenticated routes
router.post("/create", authMiddleware, createPayment);
router.post("/cancel", authMiddleware, cancelOrder);

export default router;