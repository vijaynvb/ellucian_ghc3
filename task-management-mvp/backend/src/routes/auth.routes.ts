import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { authValidation } from "../validations/auth.validation";

const router = Router();

router.post("/login", validate(authValidation.login), authController.login);
router.post("/logout", requireAuth, authController.logout);

export default router;
