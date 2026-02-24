import express from "express";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;