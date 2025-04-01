import { z } from "zod";

export const transactionSchema = z.object({
  toAccountId: z.string(),
  amount: z.string(),
});
