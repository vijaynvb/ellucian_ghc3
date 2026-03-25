import { Router } from "express";
import { reportController } from "../controllers/report.controller";
import { validate } from "../middleware/validate.middleware";
import { reportValidation } from "../validations/report.validation";

const router = Router();

router.get("/status-summary", reportController.statusSummary);
router.get("/overdue", validate(reportValidation.overdue), reportController.overdue);
router.get("/productivity", validate(reportValidation.productivity), reportController.productivity);
router.get("/trend", validate(reportValidation.trend), reportController.trend);

export default router;
