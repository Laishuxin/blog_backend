import { UserModel, UserModelAuth } from 'src/database/models';

export default class CreateUserDto implements UserModel{
  readonly username: string;
  readonly nickname: string;
  readonly password: string;
  readonly auth: UserModelAuth;
  readonly email: string;
  readonly avatar: string | null;
}
