import { Request, Response } from "express";
import TransactionModel from "src/model/transaction.model";
import { z } from "zod";
import { transactionSchema } from "src/validation/transaction.validation";

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
    const { toAccountId, amount } = req.body;
    if (id === ":id" || isNaN(+id)) {
      res.status(400).json({
        error: "invalid id",
      });
      return;
    }

    const validatedData = transactionSchema.parse(req.body);

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    if (userId === toAccountId) {
      res
        .status(400)
        .json({ error: "Can not make transaction into your own account" });
    }

    try {
      const createTransaction = await TransactionModel.create(
        +userId,
        +toAccountId,
        +amount,
        +id
      );
      res.status(201).json({ createTransaction });
    } catch (error) {
      console.log(error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
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
      console.log(getTransaction);
      if (!getTransaction) {
        res.status(404).json({ error: "no data" });
        return;
      }

      if (
        getTransaction.fromAccountId !== userId ||
        getTransaction.toAccountId !== userId
      ) {
        res.status(403).json({ error: "User not authenticated" });
        return;
      }
      res.status(200).json({ getTransaction });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "somwething went wrong" });
    }
  }
}
