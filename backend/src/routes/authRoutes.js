import express from "express";
import {
  changePassword,
  deleteAccount,
  forgotPassword,
  getProfile,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  verifyEmail,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/change-password", protect, changePassword);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.post("/logout", protect, logoutUser);
router.delete("/delete-account", protect, deleteAccount);

export default router;
