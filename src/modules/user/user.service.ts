import { HttpStatus, Injectable } from '@nestjs/common';
import { insert, query } from 'src/database';
import { UserAuthDefault } from '.';
import CreateUserDto from './dto/CreateUserDto';
import { UserDaoFields, UserDao } from './dao/user.dao';
import { User } from './class/User';

export interface ServiceResponse<T = any> {
  data?: T;
  status: HttpStatus;
  message: string;
  success: boolean;
}

@Injectable()
export class UserService {
  /**
   * Find one user by indicating username
   * @param username user name
   * @warn password_salt should be deleted after validating.
   * @returns user_id, create_at, update_at, username, nickname, password_salt, auth, email.
   */
  public async findOneByUsername(
    username: string,
  ): Promise<UserDao | undefined> {
    const sql = `
      SELECT ${UserDaoFields.userId}, ${UserDaoFields.createAt},
        ${UserDaoFields.updateAt}, ${UserDaoFields.username},
        ${UserDaoFields.nickname}, ${UserDaoFields.passwordSalt},
        ${UserDaoFields.auth}, ${UserDaoFields.email}, ${UserDaoFields.password}
      FROM t_user 
      WHERE ${UserDaoFields.username} = '${username}'
    `;

    let result = await query<UserDao>(sql, {logging: false});
    return result.length !== 0
      ? Promise.resolve(result[0])
      : Promise.resolve(undefined);
  }

  /**
   * User register.
   * @param userDto Create user dto.
   */
  public async createUser(userDto: CreateUserDto): Promise<ServiceResponse> {
    let {
      username,
      nickname,
      password,
      auth = UserAuthDefault,
      email,
      avatar = null,
      password_salt,
    } = userDto;

    // To find whether user has existed. if true return handling.
    const user = await this.findOneByUsername(username);
    if (user)
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'user exists',
        success: false,
      };

    // Execute sql.
    const sql = `
      INSERT INTO t_user (
        ${UserDaoFields.userId}, ${UserDaoFields.username},
        ${UserDaoFields.nickname}, ${UserDaoFields.password},
        ${UserDaoFields.passwordSalt}, ${UserDaoFields.auth},
        ${UserDaoFields.email}, ${UserDaoFields.avatar}
      )
      VALUES
      (UUID(), '${username}', '${nickname}', '${password}', '${password_salt}', ${auth}, '${email}', '${avatar}');
    `;

    const message = await insert(sql, {
      logging: process.env.NODE_ENV !== 'production',
    });
    return message === null
      ? { status: HttpStatus.OK, message: 'success', success: true }
      : { status: HttpStatus.BAD_REQUEST, message, success: false };
  }

  public static getUser(userDao: UserDao): User {
    return {
      user_id: userDao.user_id,
      createAt: userDao.create_at,
      updateAt: userDao.update_at,
      username: userDao.username,
      nickname: userDao.nickname,
      email: userDao.email,
      avatar: userDao.avatar,
      auth: parseInt(userDao.auth),
    };
  }
}
