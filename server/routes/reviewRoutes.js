import express from "express"
import { getProductReviews, createReview, updateReview, deleteReview } from "../controllers/reviewController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/', authMiddleware, createReview);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);
// router.put('/:id/vote', voteReview);

export default router;