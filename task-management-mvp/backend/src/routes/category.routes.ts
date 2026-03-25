import { Router } from "express";
import { categoryController } from "../controllers/category.controller";
import { requireRole } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { categoryValidation } from "../validations/category.validation";

const router = Router();

router.get("/", validate(categoryValidation.listCategories), categoryController.list);
router.get("/:categoryId", validate(categoryValidation.categoryById), categoryController.getById);
router.post(
  "/",
  requireRole("ADMIN"),
  validate(categoryValidation.createCategory),
  categoryController.create
);
router.put(
  "/:categoryId",
  requireRole("ADMIN"),
  validate(categoryValidation.updateCategory),
  categoryController.update
);
router.delete(
  "/:categoryId",
  requireRole("ADMIN"),
  validate(categoryValidation.deleteCategory),
  categoryController.remove
);

export default router;