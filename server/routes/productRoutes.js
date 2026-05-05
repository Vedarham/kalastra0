import express from "express";
import { createManualProduct, createAIProduct, getProducts} from "../controllers/productController.js";
import { upload } from "../middlewares/upload.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js"

const router = express.Router();

const fileFields = [
  { name: 'image_0' },
  { name: 'image_1' },
  { name: 'image_2' },
  { name: 'image_3' },
  { name: 'image_4' },
  { name: 'audio_question_0' },
  { name: 'audio_question_1' },
  { name: 'audio_question_2' },
  { name: 'audio_question_3' },
  { name: 'audio_question_4' },
  { name: 'audio_question_5' },
  { name: 'audio_question_6' },
  { name: 'audio_question_7' }
];

// Get all or single product
router.get("/", getProducts);

// router.get("/:id", getProductById);

// Create product (manual input)
router.post("/manual", authMiddleware, authorizeRoles("seller"), createManualProduct);

// Create product (AI-assisted, with audio/image)
router.post("/ai-generate-listing", upload.fields(fileFields), createAIProduct);

// Get Dashboard
// router.get("/dashboard",
//   authMiddleware,
//   authorizeRoles("admin", "seller"),
//   getDashboard
// );

export default router;
