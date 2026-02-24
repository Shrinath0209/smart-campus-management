import express from "express";
import { createCourse, getCourses } from "../controllers/courseController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createCourse);
router.get("/", protect, getCourses);

export default router;