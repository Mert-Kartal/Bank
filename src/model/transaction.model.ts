import prisma from "src/db";

export default class TransactionModel {
  // todo;
  static async create(
    fromAccountId: number,
    toAccountId: number,
    amount: number,
    userId: number
  ) {
    try {
      return await prisma.$transaction(async (tx) => {
        const fromAccount = await tx.account.findUnique({
          where: { id: fromAccountId },
        });

        if (!fromAccount || fromAccount.deletedAt) {
          throw new Error("Sender account not found or is deleted.");
        }

        if (fromAccount.balance < amount) {
          throw new Error("insufficient funds.");
        }
        const toAccount = await tx.account.findUnique({
          where: { id: toAccountId },
        });

        if (!toAccount || toAccount.deletedAt) {
          throw new Error("Recipient account not found or is deleted.");
        }

        await tx.account.update({
          where: { id: fromAccountId },
          data: { balance: { decrement: amount } },
        });

        await tx.account.update({
          where: { id: toAccountId },
          data: { balance: { increment: amount } },
        });

        return await tx.transaction.create({
          data: { fromAccountId, toAccountId, amount, userId },
        });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async getByTrxId(id: number) {
    try {
      const trx = await prisma.transaction.findUnique({ where: { id } });
      return trx;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
