import express from "express";
import { createProject } from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to create project (Protected by auth middleware)
router.post("/", protect, createProject);

export default router;