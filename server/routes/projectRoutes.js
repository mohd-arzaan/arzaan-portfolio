import express from "express";
import { 
  createProject, 
  getProjects, 
  updateProject, 
  deleteProject 
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route (Frontend ke liye)
router.get("/", getProjects);

// Protected routes (Admin ke liye)
router.post("/", protect, createProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

export default router;