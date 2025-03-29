import { z } from "zod";

export const registerSchema = z
  .object({
    firstname: z
      .string()
      .min(4, "min. 2 character required")
      .max(20, "max. 20 character total"),
    lastname: z
      .string()
      .min(4, "min. 2 character required")
      .max(20, "max. 20 character total"),
    username: z
      .string()
      .min(8, "min. 8 character required")
      .max(16, "max. 16 character total")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can contain only letter, number and underline (_) "
      ),
    password: z
      .string()
      .min(8, "min. 8 character required")
      .max(16, "max. 16 character total"),
    verifyPassword: z
      .string()
      .min(8, "min. 8 character required")
      .max(16, "max. 16 character total"),
  })
  .refine((data) => data.password === data.verifyPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
