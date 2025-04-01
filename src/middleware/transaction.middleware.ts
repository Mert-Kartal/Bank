import { Request, Response, NextFunction } from "express";
import { transactionSchema } from "src/validation/transaction.validation";

export default class trxMiddleware {
  static validateTransaction(req: Request, res: Response, next: NextFunction) {
    const result = transactionSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ error: result.error.format() });
      return;
    }

    next();
  }
}
