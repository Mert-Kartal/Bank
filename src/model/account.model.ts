import prisma from "src/config/db";

import { AccountReqBody, TransactionReqBody } from "src/dto/types";
type partialReqBody = Partial<AccountReqBody>;

export default class AccountModel {
  static async create(
    name: string,
    ownerId: number,
    balance: number
  ): Promise<AccountReqBody> {
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

  static async getById(id: number): Promise<AccountReqBody | null> {
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

  static async get(): Promise<AccountReqBody[]> {
    try {
      const account = await prisma.account.findMany();
      return account;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async update(
    id: number,
    payload: partialReqBody
  ): Promise<AccountReqBody> {
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

  static async delete(id: number): Promise<AccountReqBody> {
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

  static async getTrxByAccount(
    accountId: number
  ): Promise<TransactionReqBody[]> {
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
