import { z } from "zod";

export const accountSchema = z.object({
  name: z
    .string()
    .min(3, "Account name must have at least 3 characters")
    .max(30, "Account name must have at most 30 characters"),

  ownerId: z
    .number()
    .int("Owner ID must be an integer")
    .min(1, "Owner ID must be at least 1"),

  balance: z.number().min(0, "Balance must be at least 0"),
});
