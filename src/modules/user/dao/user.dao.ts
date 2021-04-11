export class UserDao {
  user_id: string;
  create_at: string;
  update_at: string;
  username: string;
  nickname: string;
  email: string;
  avatar: string;
  password: string;
  password_salt: string;

  // 1: admin, 2: user, 3: friend, 4: other.
  auth: string;
}

export enum UserDaoFields {
  userId = 'user_id',
  createAt = 'create_at',
  updateAt = 'update_at',
  username = 'username',
  nickname = 'nickname',
  email = 'email',
  avatar = 'avatar',
  password = 'password',
  passwordSalt = 'password_salt',
  auth = 'auth',
}
