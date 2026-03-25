import { z } from "zod";

const roleSchema = z.enum(["END_USER", "ADMIN"]);
const statusSchema = z.enum(["ACTIVE", "INACTIVE"]);

export const userValidation = {
  listUsers: z.object({
    query: z.object({
      page: z.coerce.number().int().min(1).optional(),
      pageSize: z.coerce.number().int().min(1).max(100).optional(),
      role: roleSchema.optional(),
      status: statusSchema.optional()
    }),
    body: z.object({}).optional(),
    params: z.object({}).optional()
  }),
  createUser: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(8),
      role: roleSchema,
      status: statusSchema.optional()
    }),
    query: z.object({}).optional(),
    params: z.object({}).optional()
  }),
  updateUser: z.object({
    params: z.object({ userId: z.string().min(1) }),
    body: z
      .object({
        role: roleSchema.optional(),
        status: statusSchema.optional()
      })
      .refine((value) => Object.keys(value).length > 0, "At least one field is required"),
    query: z.object({}).optional()
  }),
  userById: z.object({
    params: z.object({ userId: z.string().min(1) }),
    query: z.object({}).optional(),
    body: z.object({}).optional()
  })
};
