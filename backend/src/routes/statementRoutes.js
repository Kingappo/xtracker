import express from "express";
import { getStatement } from "../controllers/statementController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getStatement);

export default router;
