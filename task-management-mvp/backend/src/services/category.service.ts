import { categories } from "../data/inMemoryDb";
import { Category } from "../models/category.model";
import { AppError } from "../utils/appError";
import { buildPagination } from "../utils/pagination";

const normalizeName = (name: string): string => name.trim().toLowerCase();

export const categoryService = {
  list: async (query: Record<string, unknown>) => {
    const page = Number(query.page ?? 1);
    const pageSize = Number(query.pageSize ?? 20);
    const search = typeof query.search === "string" ? query.search.toLowerCase().trim() : "";

    let filtered = [...categories];

    if (query.isActive !== undefined) {
      const isActive = query.isActive === true || query.isActive === "true";
      filtered = filtered.filter((item) => item.isActive === isActive);
    }

    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(search) ||
          (item.description ?? "").toLowerCase().includes(search)
      );
    }

    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return {
      data,
      pagination: buildPagination(page, pageSize, filtered.length)
    };
  },

  create: async (payload: { name: string; description?: string | null; isActive?: boolean }) => {
    const duplicate = categories.some((item) => normalizeName(item.name) === normalizeName(payload.name));
    if (duplicate) {
      throw new AppError("BAD_REQUEST", 400, "Category name already exists.");
    }

    const timestamp = new Date().toISOString();

    const category: Category = {
      categoryId: `cat_${1000 + categories.length + 1}`,
      name: payload.name.trim(),
      description: payload.description ?? null,
      isActive: payload.isActive ?? true,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    categories.push(category);
    return category;
  },

  getById: async (categoryId: string) => {
    const category = categories.find((item) => item.categoryId === categoryId);
    if (!category) {
      throw new AppError("NOT_FOUND", 404, `Category with id ${categoryId} not found.`);
    }

    return category;
  },

  update: async (
    categoryId: string,
    payload: { name?: string; description?: string | null; isActive?: boolean }
  ) => {
    const category = categories.find((item) => item.categoryId === categoryId);
    if (!category) {
      throw new AppError("NOT_FOUND", 404, `Category with id ${categoryId} not found.`);
    }

    if (payload.name !== undefined) {
      const duplicate = categories.some(
        (item) =>
          item.categoryId !== categoryId && normalizeName(item.name) === normalizeName(payload.name as string)
      );

      if (duplicate) {
        throw new AppError("BAD_REQUEST", 400, "Category name already exists.");
      }

      category.name = payload.name.trim();
    }

    if (payload.description !== undefined) {
      category.description = payload.description;
    }

    if (payload.isActive !== undefined) {
      category.isActive = payload.isActive;
    }

    category.updatedAt = new Date().toISOString();

    return category;
  },

  remove: async (categoryId: string) => {
    const index = categories.findIndex((item) => item.categoryId === categoryId);
    if (index === -1) {
      throw new AppError("NOT_FOUND", 404, `Category with id ${categoryId} not found.`);
    }

    categories.splice(index, 1);
  }
};