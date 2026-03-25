import { z } from "zod";

const categoryIdSchema = z.string().min(1);

export const categoryValidation = {
  listCategories: z.object({
    query: z.object({
      page: z.coerce.number().int().min(1).optional(),
      pageSize: z.coerce.number().int().min(1).max(100).optional(),
      isActive: z.coerce.boolean().optional(),
      search: z.string().min(1).max(120).optional()
    }),
    body: z.object({}).optional(),
    params: z.object({}).optional()
  }),
  createCategory: z.object({
    body: z.object({
      name: z.string().min(2).max(80),
      description: z.string().max(500).nullable().optional(),
      isActive: z.boolean().optional()
    }),
    query: z.object({}).optional(),
    params: z.object({}).optional()
  }),
  categoryById: z.object({
    params: z.object({ categoryId: categoryIdSchema }),
    query: z.object({}).optional(),
    body: z.object({}).optional()
  }),
  updateCategory: z.object({
    params: z.object({ categoryId: categoryIdSchema }),
    body: z
      .object({
        name: z.string().min(2).max(80).optional(),
        description: z.string().max(500).nullable().optional(),
        isActive: z.boolean().optional()
      })
      .refine((value) => Object.keys(value).length > 0, "At least one field is required"),
    query: z.object({}).optional()
  }),
  deleteCategory: z.object({
    params: z.object({ categoryId: categoryIdSchema }),
    query: z.object({}).optional(),
    body: z.object({}).optional()
  })
};