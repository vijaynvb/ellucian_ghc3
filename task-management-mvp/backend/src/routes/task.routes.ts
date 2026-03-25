import { Router } from "express";
import { taskController } from "../controllers/task.controller";
import { validate } from "../middleware/validate.middleware";
import { taskValidation } from "../validations/task.validation";

const router = Router();

router.get("/", validate(taskValidation.listTasks), taskController.list);
router.post("/", validate(taskValidation.createTask), taskController.create);
router.get("/:taskId", validate(taskValidation.taskById), taskController.getById);
router.patch("/:taskId", validate(taskValidation.updateTask), taskController.update);
router.patch("/:taskId/status", validate(taskValidation.updateStatus), taskController.updateStatus);
router.patch("/:taskId/assignee", validate(taskValidation.updateAssignee), taskController.updateAssignee);

export default router;
