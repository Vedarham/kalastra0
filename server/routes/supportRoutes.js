import express from "express";
import { submitSupportTicket } from "../controllers/supportController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/", submitSupportTicket);

export default router;
