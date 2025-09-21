import express from "express";
import multer from "multer";
import { createManualProduct,createAIProduct ,getProducts} from "../controllers/productController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

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
router.post("/manual", authMiddleware, createManualProduct);

// Create product (AI-assisted, with audio/image)
router.post("/ai-generate-listing",upload.fields(fileFields), createAIProduct);

export default router;
