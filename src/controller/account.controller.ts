import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Request, Response } from "express";
import AccountModel from "src/model/account.model";

export default class AccountController {
  static async create(
    req: Request<{}, {}, { name: string; balance: string }>,
    res: Response
  ) {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }
    const { name, balance } = req.body;

    try {
      const createAccount = await AccountModel.create(name, +userId, +balance);
      res.status(201).json({ createAccount });
    } catch (error) {
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
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

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

      if (getAccount.ownerId !== userId) {
        res.status(403).json({ error: "Unauthorized Request" });
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
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

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
      console.log(getAccount);
      if (!getAccount || getAccount.deletedAt) {
        res.status(404).json({ error: "no data" });
        return;
      }

      if (getAccount.ownerId !== userId) {
        res.status(403).json({ error: "Unauthorized Request" });
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
    const userId = req.user?.id;
    const { amount } = req.body;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

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
      console.log(getAccount);
      if (!getAccount || getAccount.deletedAt) {
        res.status(404).json({ error: "no data" });
        return;
      }

      if (getAccount.ownerId !== userId) {
        res.status(403).json({ error: "Unauthorized Request" });
        return;
      }

      if (+amount > getAccount.balance) {
        res.status(422).json({ error: "insufficient funds" });
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
    const userId = req.user?.id;
    const { name } = req.body;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

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

      const getAccount = await AccountModel.getById(+id);

      if (!getAccount || getAccount.deletedAt) {
        res.status(404).json({ error: "no data" });
        return;
      }

      if (getAccount.ownerId !== userId) {
        res.status(403).json({ error: "Unauthorized Request" });
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
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    try {
      const getAccount = await AccountModel.getById(+id);

      if (!getAccount || getAccount.deletedAt) {
        res.status(404).json({ error: "no data" });
        return;
      }

      if (getAccount.ownerId !== userId) {
        res.status(403).json({ error: "Unauthorized Request" });
        return;
      }

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
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    try {
      const getAccount = await AccountModel.getById(+id);

      if (!getAccount || getAccount.deletedAt) {
        res.status(404).json({ error: "no data" });
        return;
      }

      if (getAccount.ownerId !== userId) {
        res.status(403).json({ error: "Unauthorized Request" });
        return;
      }

      const getAccountTransactions = await AccountModel.getTrxByAccount(+id);
      if (getAccountTransactions.length === 0) {
        res.status(404).json({ error: "no data" });
        return;
      }

      res.status(200).json({ getAccountTransactions });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "somwething went wrong" });
    }
  }
}
