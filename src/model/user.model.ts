import prisma from "src/config/db";

import { UserReqBody, AccountReqBody, TransactionReqBody } from "src/dto/types";
type partialReqBody = Partial<UserReqBody>;

export default class UserModel {
  static async create(
    firstname: string,
    lastname: string,
    username: string,
    password: string
  ): Promise<UserReqBody> {
    try {
      const user = await prisma.user.create({
        data: {
          firstname,
          lastname,
          username,
          password,
          createdAt: new Date(),
        },
      });
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async getById(id: number): Promise<UserReqBody | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async getByUsername(username: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async get(): Promise<UserReqBody[]> {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async update(
    id: number,
    payload: partialReqBody
  ): Promise<UserReqBody> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: { ...payload },
      });
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async delete(id: number): Promise<UserReqBody> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async getTrxByUser(id: number): Promise<TransactionReqBody[]> {
    try {
      const userAccounts = await prisma.account.findMany({
        where: { ownerId: id },
        select: { id: true },
      });
      console.log(userAccounts);
      const accountIds = userAccounts.map((account) => account.id);
      console.log(accountIds);
      if (accountIds.length === 0) {
        return [];
      }

      const transactions = await prisma.transaction.findMany({
        where: {
          OR: [
            { fromAccountId: { in: accountIds } },
            { toAccountId: { in: accountIds } },
          ],
        },
      });
      return transactions;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async getAccByUser(userId: number): Promise<AccountReqBody[]> {
    try {
      const accounts = await prisma.account.findMany({
        where: { ownerId: userId },
      });
      return accounts;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
