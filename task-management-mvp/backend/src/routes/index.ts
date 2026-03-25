import { Router } from "express";
import authRoutes from "./auth.routes";
import reportRoutes from "./report.routes";
import taskRoutes from "./task.routes";
import userRoutes from "./user.routes";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.use("/auth", authRoutes);
router.use(requireAuth);
router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);
router.use("/reports", reportRoutes);

export default router;
