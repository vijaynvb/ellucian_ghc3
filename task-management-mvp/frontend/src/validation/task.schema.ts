import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  description: z.string().max(2000).nullable().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  dueDate: z.string().nullable().optional(),
  assignedTo: z.string().nullable().optional(),
  categoryId: z.string().optional()
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
