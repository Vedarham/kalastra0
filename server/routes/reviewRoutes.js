import express from "express"
import { getProductReviews, createReview, updateReview, deleteReview } from "../controllers/reviewController.js";

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);
// router.put('/:id/vote', voteReview);

export default router;