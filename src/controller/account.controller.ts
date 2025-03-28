import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Request, Response } from "express";
import AccountModel from "src/model/account.model";
export default class AccountController {
  static async create(
    req: Request<{}, {}, { name: string; ownerId: string; balance: string }>,
    res: Response
  ) {
    if (Object.keys(req.body).length < 3) {
      res.status(400).json({
        error: "missing data",
      });
      return;
    }
    const { name, ownerId, balance } = req.body;
    try {
      if (isNaN(+ownerId) || isNaN(+balance)) {
        res.status(400).json({
          error: "invalid data",
        });
        return;
      }
      const createAccount = await AccountModel.create(name, +ownerId, +balance);
      res.status(201).json({ createAccount });
    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          res.status(404).json({
            error: "wrong id",
          });
          return;
        }
      }
      res.status(500).json({ error: "somwething went wrong" });
    }
  }

  static async getById(req: Request<{ id: string }>, res: Response) {
    const id = req.params.id;
    try {
      if (id === ":id" || isNaN(+id)) {
        res.status(400).json({
          error: "invalid id",
        });
        return;
      }

      const getAccount = await AccountModel.getById(+id);

      if (!getAccount || getAccount.deletedAt) {
        res.status(404).json({ error: "no data" });
        return;
      }
      res.status(200).json({ getAccount });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "somwething went wrong" });
    }
  }

  static async deposit(
    req: Request<{ id: string }, {}, { amount: string }>,
    res: Response
  ) {
    const id = req.params.id;
    const { amount } = req.body;
    try {
      if (id === ":id" || isNaN(+id)) {
        res.status(400).json({
          error: "invalid id",
        });
        return;
      }

      if (!amount || isNaN(+amount) || +amount < 1) {
        res.status(400).json({
          error: "invalid data",
        });
        return;
      }

      const getAccount = await AccountModel.getById(+id);

      if (!getAccount) {
        res.status(404).json({ error: "no data" });
        return;
      }
      const updatedBalance = getAccount.balance + +amount;
      const updateAccount = await AccountModel.update(+id, {
        balance: updatedBalance,
      });
      res.status(200).json({ updateAccount });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "somwething went wrong" });
    }
  }

  static async withdraw(
    req: Request<{ id: string }, {}, { amount: string }>,
    res: Response
  ) {
    const id = req.params.id;
    const { amount } = req.body;
    try {
      if (id === ":id" || isNaN(+id)) {
        res.status(400).json({
          error: "invalid id",
        });
        return;
      }

      if (!amount || isNaN(+amount) || +amount < 1) {
        res.status(400).json({
          error: "invalid data",
        });
        return;
      }

      const getAccount = await AccountModel.getById(+id);

      if (!getAccount) {
        res.status(404).json({ error: "no data" });
        return;
      }

      if (+amount > getAccount.balance) {
        res.status(404).json({ error: "insufficient funds" });
        return;
      }
      const updatedBalance = getAccount.balance - +amount;
      const updateAccount = await AccountModel.update(+id, {
        balance: updatedBalance,
      });
      res.status(200).json({ updateAccount });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "somwething went wrong" });
    }
  }

  static async update(
    req: Request<{ id: string }, {}, { name: string }>,
    res: Response
  ) {
    const id = req.params.id;
    const { name } = req.body;
    try {
      if (id === ":id" || isNaN(+id)) {
        res.status(400).json({
          error: "invalid id",
        });
        return;
      }

      if (!name) {
        res.status(400).json({
          error: "invalid data",
        });
        return;
      }
      const updateAccount = await AccountModel.update(+id, { name });
      res.status(200).json({ updateAccount });
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
      res.status(500).json({ error: "somwething went wrong" });
    }
  }

  static async delete(req: Request<{ id: string }>, res: Response) {
    const id = req.params.id;
    if (id === ":id" || isNaN(+id)) {
      res.status(400).json({
        error: "invalid id",
      });
      return;
    }
    try {
      const deletedUser = await AccountModel.delete(+id);

      res.status(200).json({ deletedUser });
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

      res.status(500).json({ error: "somwething went wrong" });
    }
  }

  static async getTransactions(req: Request, res: Response) {
    const id = req.params.id;
    if (id === ":id" || isNaN(+id)) {
      res.status(400).json({
        error: "invalid id",
      });
      return;
    }
    try {
      const getAccountTransactions = await AccountModel.getTrxByAccount(+id);
      if (getAccountTransactions.length === 0) {
        res.status(404).json({ error: "no data" });
        return;
      }

      res.status(200).json({ getAccountTransactions });
    } catch (error) {}
  }
}
