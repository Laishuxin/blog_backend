export enum UserAuth {
  ADMIN = 0,
  USER = 1,
  FRIEND = 2,
  OTHER = 3,
}
export class User {
  public username?: string;
  public nickname?: string;
  public email?: string;
  public avatar?: string;
  public auth?: UserAuth;
  public userId?: string;
  public createAt?: string;
  public updateAt?: string;
}
