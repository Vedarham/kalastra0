import express from "express";
import { createManualProduct, createAIProduct, getProducts, getMyProducts, getProductById, deleteProduct, updateProduct } from "../controllers/productController.js";
import { upload } from "../middlewares/upload.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js"

const router = express.Router();

// Public Route
router.get("/", getProducts);

// Seller Routes
router.get("/my", authMiddleware, authorizeRoles("seller"), getMyProducts);

// Get Single product
router.get("/:id", getProductById);

// Manual Product Creation
router.post("/manual", authMiddleware, authorizeRoles("seller"), upload.array("images", 5), createManualProduct);

// AI Product Creation (Audio + Images)
router.post(
  "/ai-generate-listing",
  authMiddleware,
  authorizeRoles("seller"),
  upload.fields([
    { name: "image_0", maxCount: 1 },
    { name: "image_1", maxCount: 1 },
    { name: "image_2", maxCount: 1 },
    { name: "image_3", maxCount: 1 },
    { name: "image_4", maxCount: 1 },
    { name: "audio_question_0", maxCount: 1 },
    { name: "audio_question_1", maxCount: 1 },
    { name: "audio_question_2", maxCount: 1 },
    { name: "audio_question_3", maxCount: 1 },
    { name: "audio_question_4", maxCount: 1 },
    { name: "audio_question_5", maxCount: 1 },
    { name: "audio_question_6", maxCount: 1 },
    { name: "audio_question_7", maxCount: 1 },
  ]),
  createAIProduct
);

// Update Product
router.put("/:id", authMiddleware, authorizeRoles("seller"), upload.array("images", 5), updateProduct);

// Delete (soft delete)
router.delete("/:id", authMiddleware, authorizeRoles("seller"), deleteProduct);

export default router;
