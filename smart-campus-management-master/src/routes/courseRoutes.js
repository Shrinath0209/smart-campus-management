import express from "express";
import { createCourse, getCourses, enrollInCourse, seedCourses } from "../controllers/courseController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createCourse);
router.get("/", protect, getCourses);
router.post("/seed", protect, seedCourses);
router.post("/:id/enroll", protect, enrollInCourse);

export default router;