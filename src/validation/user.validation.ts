import { z } from "zod";

export const userUpdateSchema = z.object({
  firstname: z
    .string()
    .min(4, "First name must have at least 4 characters")
    .max(20, "First name must have at most 20 characters")
    .optional(),
  lastname: z
    .string()
    .min(4, "Last name must have at least 4 characters")
    .max(20, "Last name must have at most 20 characters")
    .optional(),
  username: z
    .string()
    .min(8, "Username must have at least 8 characters")
    .max(16, "Username must have at most 16 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .optional(),
});
