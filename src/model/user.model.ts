import prisma from "src/db";
import bcrypt from "bcrypt";

import { UserReqBody } from "src/types";
type partialReqBody = Partial<UserReqBody>;

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}
export default class UserModel {
  static async create(
    firstname: string,
    lastname: string,
    username: string,
    password: string
  ): Promise<UserReqBody> {
    try {
      const hashedPassword = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          firstname,
          lastname,
          username,
          password: hashedPassword,
          createdAt: new Date(),
        },
      });
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async getById(id: number) {
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

  static async get() {
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

  static async delete(id: number) {
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

  static async getTrxByUser(id: number) {
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

  static async getAccByUser(userId: number) {
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
