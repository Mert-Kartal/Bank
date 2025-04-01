import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import UserModel from "src/model/user.model";
import dotenv from "dotenv";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET!;

export default class authController {
  static async register(
    req: Request<
      {},
      {},
      {
        firstname: string;
        lastname: string;
        username: string;
        password: string;
        verifyPassword: string;
      }
    >,
    res: Response
  ) {
    const { firstname, lastname, username, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const createUser = await UserModel.create(
        firstname,
        lastname,
        username,
        hashedPassword
      );
      const token = jwt.sign({ userId: createUser.id }, jwtSecret, {
        expiresIn: "1h",
      });
      res.status(201).json({ createUser, token: token });
    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          res.status(400).json({
            error: "this username is taken",
          });
          return;
        }
      }
      res.status(500).json({ error: "something went wrong" });
    }
  }

  static async login(
    req: Request<
      {},
      {},
      {
        username: string;
        password: string;
      }
    >,
    res: Response
  ) {
    const { username, password } = req.body;
    try {
      const user = await UserModel.getByUsername(username);

      if (!user || user.deletedAt) {
        res.status(400).json({ error: "Invalid username or password" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(400).json({ error: "Invalid username or password" });
        return;
      }

      const token = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: "1h",
      });

      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
}
