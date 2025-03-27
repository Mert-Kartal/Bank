export interface UserReqBody {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
}

export type partialReqBody = Partial<UserReqBody>;
