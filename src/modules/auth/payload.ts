import { UserAuthEnum } from '../user';
import { User } from '../user/classes/User';

export interface Payload {
  sub: string;
  username: string;
  nickname: string;
  auth: UserAuthEnum;
}
