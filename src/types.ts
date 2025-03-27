export interface UserReqBody {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
}

export interface AccountReqBody {
  name: string;
  ownerId: number;
  balance: number;
}
