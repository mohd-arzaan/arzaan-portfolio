import express from "express";
import { getSocials, addSocial, deleteSocial } from "../controllers/socialController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getSocials)
  .post(protect, addSocial);

router.route("/:id")
  .delete(protect, deleteSocial);

export default router;