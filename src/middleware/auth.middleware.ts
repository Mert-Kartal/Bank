import { Request, Response, NextFunction } from "express";
import { registerSchema } from "src/validation/register.validation";
import { loginSchema } from "src/validation/login.validation";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET!;

interface JwtPayload {
  userId: number;
  iat: number;
  exp: number;
}

export default class authmiddleware {
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
    const token = req.header(`Authorization`)?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
      req.user = { id: decoded.userId };
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }
  }
}
