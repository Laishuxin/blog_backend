import { User, UserAuth } from "../user/classes/User";

export interface Payload {
  sub: string;
  username: string;
  nickname: string;
  auth: UserAuth;
}
