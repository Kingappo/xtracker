import express from "express";
import {
  getChartSummary,
  getCategoryBreakdown,
  getDailySummary,
  getTodaySummary,
} from "../controllers/chartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/summary", getChartSummary);
router.get("/category-breakdown", getCategoryBreakdown);
router.get("/daily", getDailySummary);
router.get("/today", getTodaySummary);

export default router;
