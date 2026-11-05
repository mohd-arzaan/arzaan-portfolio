import express from "express";
import { submitContact, getContacts, markAsRead } from "../controllers/contactController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(submitContact) // Public form submit
  .get(protect, getContacts); // Admin panel view

router.route("/:id")
  .put(protect, markAsRead); // Admin mark as read

export default router;