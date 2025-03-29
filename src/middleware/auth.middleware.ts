import { Request, Response, NextFunction } from "express";
import { registerSchema } from "src/validation/register.validation";
import { loginSchema } from "src/validation/login.validation";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET
  ? process.env.JWT_SECRET
  : "secret_key";

export default class middleware {
  static validateRegister(req: Request, res: Response, next: NextFunction) {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ error: result.error.format() });
      return;
    }

    next();
  }
  static async validateLogin(req: Request, res: Response, next: NextFunction) {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ error: result.error.format() });
      return;
    }

    next();
  }
  static authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    try {
      const decoded = jwt.verify(token, jwtSecret as string);

      req.user = decoded;

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }
  }
}
