import { Request, Response } from "express";
import TransactionModel from "src/model/transaction.model";

export default class TransactionController {
  static async create(
    req: Request<
      { id: string },
      {},
      {
        fromAccountId: string;
        toAccountId: string;
        amount: string;
      }
    >,
    res: Response
  ) {
    const id = req.params.id;
    const { fromAccountId, toAccountId, amount } = req.body;
    if (id === ":id" || isNaN(+id)) {
      res.status(400).json({
        error: "invalid id",
      });
      return;
    }

    if (!fromAccountId || !toAccountId || !amount) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    if (
      isNaN(+fromAccountId) ||
      +fromAccountId <= 0 ||
      isNaN(+toAccountId) ||
      +toAccountId <= 0 ||
      isNaN(+amount) ||
      +amount <= 0
    ) {
      res.status(400).json({ error: "All fields must be positive numbers" });
      return;
    }

    if (fromAccountId === toAccountId) {
      res.status(400).json({ error: "Cannot transfer to the same account" });
      return;
    }
    try {
      const createTransaction = await TransactionModel.create(
        +fromAccountId,
        +toAccountId,
        +amount,
        +id
      );
      res.status(201).json({ createTransaction });
    } catch (error) {
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
    try {
      const getTransaction = await TransactionModel.getByTrxId(+id);
      console.log(getTransaction);
      if (!getTransaction) {
        res.status(404).json({ error: "no data" });
        return;
      }
      res.status(200).json({ getTransaction });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "somwething went wrong" });
    }
  }
}
