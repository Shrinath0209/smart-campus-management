import express from "express";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { deleteUser, getAllUsers, getUserStats, updateUserRole } from "../controllers/userController.js";

const router = express.Router();

// Admin routes
router.get("/", protect, authorizeRoles("admin"), getAllUsers);
router.get("/stats", protect, authorizeRoles("admin"), getUserStats);
router.put("/:id/role", protect, authorizeRoles("admin"), updateUserRole);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;