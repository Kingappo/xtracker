import express from "express";
import {
  getAllUsers,
  getDashboardStats,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/users", getAllUsers);
router.get("/stats", getDashboardStats);

export default router;
