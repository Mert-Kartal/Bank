import { z } from "zod";

export const transactionSchema = z
  .object({
    fromAccountId: z.number().int().positive(),
    toAccountId: z.number().int().positive(),
    amount: z.number().positive("Amount must be greater than zero"),
    userId: z.number().int().positive(),
  })
  .refine((data) => data.fromAccountId !== data.toAccountId, {
    message: "Sender and receiver accounts must be different",
    path: ["toAccountId"],
  });
