import { categoryService } from "../src/services/category.service";

describe("Category Service", () => {
  describe("list", () => {
    it.todo("returns paginated categories and supports filters");
  });

  describe("create", () => {
    it.todo("creates a category with default isActive=true");
    it.todo("rejects duplicate category names");
  });

  describe("getById", () => {
    it.todo("returns category by id");
    it.todo("throws NOT_FOUND when category does not exist");
  });

  describe("update", () => {
    it.todo("updates category fields by id");
    it.todo("rejects duplicate name on update");
  });

  describe("remove", () => {
    it.todo("deletes category by id");
    it.todo("throws NOT_FOUND when deleting unknown category");
  });
});

void categoryService;