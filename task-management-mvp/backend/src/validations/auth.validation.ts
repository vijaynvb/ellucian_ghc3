import { z } from "zod";

export const authValidation = {
  login: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(8)
    }),
    params: z.object({}).optional(),
    query: z.object({}).optional()
  })
};
