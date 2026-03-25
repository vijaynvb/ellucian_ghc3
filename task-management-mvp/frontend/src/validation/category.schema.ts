import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  description: z.string().max(500).nullable().optional(),
  isActive: z.boolean().optional()
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
