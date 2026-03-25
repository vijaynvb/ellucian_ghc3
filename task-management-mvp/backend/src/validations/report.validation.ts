import { z } from "zod";

export const reportValidation = {
  overdue: z.object({
    query: z.object({
      page: z.coerce.number().int().min(1).optional(),
      pageSize: z.coerce.number().int().min(1).max(100).optional()
    }),
    params: z.object({}).optional(),
    body: z.object({}).optional()
  }),
  productivity: z.object({
    query: z.object({
      period: z.enum(["daily", "weekly", "monthly"]),
      fromDate: z.string().date().optional(),
      toDate: z.string().date().optional()
    }),
    params: z.object({}).optional(),
    body: z.object({}).optional()
  }),
  trend: z.object({
    query: z.object({
      granularity: z.enum(["day", "week"]),
      fromDate: z.string().date(),
      toDate: z.string().date()
    }),
    params: z.object({}).optional(),
    body: z.object({}).optional()
  })
};
