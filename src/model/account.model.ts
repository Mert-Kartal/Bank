import prisma from "src/db";

import { AccountReqBody } from "src/types";
type partialReqBody = Partial<AccountReqBody>;

export default class AccountModel {
  static async create(name: string, ownerId: number, balance: number) {
    try {
      const account = await prisma.account.create({
        data: { name, ownerId, balance, createdAt: new Date() },
      });
      return account;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async getById(id: number) {
    try {
      const account = await prisma.account.findUnique({
        where: { id },
      });
      return account;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async get() {
    try {
      const account = await prisma.account.findMany();
      return account;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async update(id: number, payload: partialReqBody) {
    try {
      const account = await prisma.account.update({
        where: { id },
        data: { ...payload },
      });
      return account;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      const account = await prisma.account.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return account;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async getTrxByAccount(accountId: number) {
    try {
      const transactions = await prisma.transaction.findMany({
        where: {
          OR: [{ fromAccountId: accountId }, { toAccountId: accountId }],
        },
      });
      return transactions;
    } catch (error) {
      throw error;
    }
  }
}
