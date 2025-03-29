import { Request } from "express";

export interface UserReqBody {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface AccountReqBody {
  name: string;
  ownerId: number;
  balance: number;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface TransactionReqBody {
  id: number;
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  userId: number;
  createdAt: Date;
}

declare global {
  namespace Express {
    interface Request {
      user?: any; //TODO
    }
  }
}
