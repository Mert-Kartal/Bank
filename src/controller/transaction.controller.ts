import { Request, Response } from "express";
import TransactionModel from "src/model/transaction.model";
import AccountModel from "src/model/account.model";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export default class TransactionController {
  static async create(
    req: Request<
      { id: string },
      {},
      {
        toAccountId: string;
        amount: string;
      }
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
    const userId = req.user?.id;

    const { toAccountId, amount } = req.body;

    if (isNaN(+toAccountId) || isNaN(+amount)) {
      res.status(400).json({ error: "Require number" });
      return;
    }
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    if (+id === +toAccountId) {
      res
        .status(400)
        .json({ error: "Can not make transaction into your own account" });
      return;
    }

    try {
      const getAccount = await AccountModel.getById(+id);

      if (!getAccount) {
        res.status(404).json({ error: "Account not found" });
        return;
      }

      if (userId !== getAccount.ownerId) {
        res.status(401).json({ error: "Unauthorized request" });
        return;
      }

      const createTransaction = await TransactionModel.create(
        +id,
        +toAccountId,
        +amount,
        userId
      );
      res.status(201).json({ createTransaction });
    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          res.status(404).json({
            error: "no account found",
          });
          return;
        }
      }
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: "somwething went wrong" });
    }
  }
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
      const getTransaction = await TransactionModel.getByTrxId(+id);

      if (!getTransaction) {
        res.status(404).json({ error: "no data" });
        return;
      }

      if (
        getTransaction.userId !== userId &&
        getTransaction.userId !== userId
      ) {
        res.status(403).json({ error: "User not authorized" });
        return;
      }
      res.status(200).json({ getTransaction });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "somwething went wrong" });
    }
  }
}
