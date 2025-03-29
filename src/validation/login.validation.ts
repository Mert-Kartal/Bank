import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(8, "min. 8 character required")
    .max(16, "max. 16 character total"),
  password: z.string().min(8, "min. 8 character required"),
});
