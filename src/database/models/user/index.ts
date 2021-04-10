import { BaseModel } from '../_base';

/**
 * User database fields
 */
export enum UserFields {
  createAt = 'create_at',
  updateAt = 'update_at',
  userId = 'user_id',
  username = 'username',
  nickname = 'nickname',
  password = 'password',
  passwordSalt = 'password_salt',
  auth = 'auth',
  email = 'email',
  avatar = 'avatar',
}

export enum UserModelAuth {
  ADMIN = 1,
  USER = 2,
  FRIEND = 3,
  OTHER = 4,
}

/**
 * User database table model
 */
export interface UserModel extends BaseModel {
  user_id?: string;
  username?: string;
  nickname?: string;
  password?: string;
  password_salt?: string;
  auth?: UserModelAuth;
  email?: string;
  avatar?: string | null;
}

const getDate = (): string => Date();
export const UserModelDefaults: UserModel = {
  update_at: getDate(),
  create_at: getDate(),
  auth: UserModelAuth.USER,
  email: '',
  avatar: null,
};
