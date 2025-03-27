import prisma from "src/db";
import bcrypt from "bcrypt";

import { UserReqBody } from "src/types";
import { partialReqBody } from "src/types";

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}
export default class UserModel {
  static async create(payload: UserReqBody): Promise<UserReqBody> {
    try {
      const hashedPassword = await hashPassword(payload.password);
      const user = await prisma.user.create({
        data: {
          ...payload,
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
}
