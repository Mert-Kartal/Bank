import { Request, Response, NextFunction } from "express";
import { accountSchema } from "src/validation/account.validation";

export default class accMiddleware {
  static validateAccount(req: Request, res: Response, next: NextFunction) {
    const result = accountSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ error: result.error.format() });
      return;
    }

    next();
  }
}
