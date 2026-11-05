import express from "express";
import { getAbout, updateAbout } from "../controllers/aboutController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getAbout)          // Public: Frontend pe dikhane ke liye
  .put(protect, updateAbout); // Private: Admin panel se edit karne ke liye

export default router;