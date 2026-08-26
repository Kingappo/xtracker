import express from "express";
import {
  createReview,
  getMyReviews,
  getAllReviews,
  replyToReview,
} from "../controllers/reviewController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createReview);
router.get("/mine", getMyReviews);

// Admin-only routes
router.get("/", adminOnly, getAllReviews);
router.put("/:id/reply", adminOnly, replyToReview);

export default router;
