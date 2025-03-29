import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { Request, Response } from "express";
import UserModel from "src/model/user.model";
import { UserReqBody } from "src/dto/types";
import { userUpdateSchema } from "src/validation/user.validation";
import { z } from "zod";
type partialReqBody = Partial<UserReqBody>;

export default class UserController {
  static async getById(req: Request<{ id: string }>, res: Response) {
    const id = req.params.id;

    if (id === ":id" || isNaN(+id)) {
      res.status(400).json({
        error: "invalid id",
      });
      return;
    }
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    try {
      const getUser = await UserModel.getById(+id);

      if (!getUser || getUser.deletedAt) {
        res.status(404).json({ error: "no data" });
        return;
      }
      res.status(200).json({ getUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "somwething went wrong" });
    }
  }

  static async get(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    try {
      const allUsers = await UserModel.get();
      if (allUsers.length === 0) {
        res.status(404).json({
          error: "no data",
        });
        return;
      }
      res.status(200).json({ allUsers });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "somwething went wrong" });
    }
  }

  static async update(
    req: Request<
      { id: string },
      {},
      { firstname?: string; lastname?: string; username?: string }
    >,
    res: Response
  ) {
    const id = req.params.id;

    if (id === ":id" || isNaN(+id)) {
      res.status(400).json({
        error: "invalid id",
      });
      return;
    }

    const validatedData = userUpdateSchema.parse(req.body);

    const whiteList = ["firstname", "lastname", "username"] as const;

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    try {
      const whiteListPayload: partialReqBody = {};

      whiteList.forEach((fieldName) => {
        const value = req.body[fieldName as keyof typeof req.body];
        if (value) {
          whiteListPayload[fieldName] = value;
        }
      });

      console.log(whiteListPayload);
      const updatedUser = await UserModel.update(+id, whiteListPayload);
      res.status(200).json({ updatedUser });
    } catch (error) {
      console.log(error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          res.status(404).json({
            error: "no user found",
          });
          return;
        }
        if (error.code === "P2002") {
          res.status(400).json({
            error: "this username is taken",
          });
          return;
        }
      }

      if (error instanceof PrismaClientValidationError) {
        res.status(400).json({
          error: "missing data",
        });
        return;
      }

      res.status(500).json({ error: "somwething went wrong" });
    }
  }

  static async delete(req: Request<{ id: string }>, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    try {
      const id = req.params.id;
      if (id === ":id" || isNaN(+id)) {
        res.status(400).json({
          error: "invalid id",
        });
        return;
      }
      const deletedUser = await UserModel.delete(+id);

      res.status(200).json({ deletedUser });
    } catch (error) {
      console.log(error);

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          res.status(404).json({
            error: "no user found",
          });
          return;
        }
      }
      res.status(500).json({ error: "somwething went wrong" });
    }
  }

  static async getTransactions(req: Request<{ id: string }>, res: Response) {
    const id = req.params.id;

    if (id === ":id" || isNaN(+id)) {
      res.status(400).json({
        error: "invalid id",
      });
      return;
    }
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    try {
      const getUserTransactions = await UserModel.getTrxByUser(+id);

      if (getUserTransactions.length === 0) {
        res.status(404).json({ error: "no data" });
        return;
      }

      res.status(200).json({ getUserTransactions });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "somwething went wrong" });
    }
  }

  static async getAccounts(req: Request<{ id: string }>, res: Response) {
    const id = req.params.id;

    if (id === ":id" || isNaN(+id)) {
      res.status(400).json({
        error: "invalid id",
      });
      return;
    }
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    try {
      const getUserAccounts = await UserModel.getAccByUser(+id);
      if (getUserAccounts.length === 0) {
        res.status(404).json({ error: "no data" });
        return;
      }

      res.status(200).json({ getUserAccounts });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "somwething went wrong" });
    }
  }
}

// index-> route-> middleware-> validation-> controller-> service-> model
