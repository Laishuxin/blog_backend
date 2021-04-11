export enum UserAuthEnum {
  ADMIN = 1,
  USER = 2,
  FRIEND = 3,
  OTHER = 4,
}

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

export const UserAuthDefault = UserAuthEnum.USER;
