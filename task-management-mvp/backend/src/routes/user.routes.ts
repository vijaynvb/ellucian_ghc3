import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { requireRole } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { userValidation } from "../validations/user.validation";

const router = Router();

router.use(requireRole("ADMIN"));

router.get("/", validate(userValidation.listUsers), userController.list);
router.post("/", validate(userValidation.createUser), userController.create);
router.get("/:userId", validate(userValidation.userById), userController.getById);
router.patch("/:userId", validate(userValidation.updateUser), userController.update);

export default router;
