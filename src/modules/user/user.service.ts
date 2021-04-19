import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { insert, query } from 'src/database';
import { UserAuthDefault } from '.';
import CreateUserDto from './dto/CreateUserDto';
import { UserDaoFields, UserDao } from './dao/user.dao';
import { User } from './class/User';
import { ServiceCode, IServiceResponse } from '..';
import { AuthService } from '../auth/auth.service';

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
        ${UserDaoFields.auth}, ${UserDaoFields.email}, 
        ${UserDaoFields.password}, ${UserDaoFields.avatar}
      FROM t_user 
      WHERE ${UserDaoFields.username} = '${username}'
    `;

    let result = await query<UserDao>(sql, { logging: false });
    return result.length !== 0
      ? Promise.resolve(result[0])
      : Promise.resolve(undefined);
  }

  public async findOneByUserId(
    userId: string,
  ): Promise<IServiceResponse<UserDao | undefined>> {
    const sql = `
      SELECT ${UserDaoFields.userId}, ${UserDaoFields.createAt},
        ${UserDaoFields.updateAt}, ${UserDaoFields.username},
        ${UserDaoFields.nickname}, ${UserDaoFields.passwordSalt},
        ${UserDaoFields.auth}, ${UserDaoFields.email}, 
        ${UserDaoFields.password}, ${UserDaoFields.avatar}
      FROM t_user 
      WHERE ${UserDaoFields.userId} = '${userId}'
    `;
    let result = await query<UserDao>(sql);
    let code: ServiceCode = ServiceCode.BAD_REQUEST;
    let message: string = 'user id error';
    let data: UserDao | undefined;
    if (result.length !== 0) {
      code = ServiceCode.SUCCESS;
      message = 'success';
      data = result[0];
    }

    return {
      code,
      data,
      message,
    };
  }

  /**
   * User register.
   * @param userDto Create user dto.
   */
  public async create(userDto: CreateUserDto): Promise<IServiceResponse> {
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
        message: 'user exists',
        code: ServiceCode.BAD_REQUEST,
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
      logging: false,
    });
    return message === null
      ? { message: 'success', code: ServiceCode.SUCCESS }
      : { message, code: ServiceCode.SERVER_ERROR };
  }

  public static getUser(userDao: UserDao): User {
    console.log(userDao);
    return {
      userId: userDao.user_id,
      createAt: userDao.create_at,
      updateAt: userDao.update_at,
      username: userDao.username,
      nickname: userDao.nickname,
      email: userDao.email,
      avatar: userDao.avatar,
      auth: parseInt(userDao.auth),
    };
  }

  public static getStatusByServiceCode = (code: ServiceCode): HttpStatus => {
    switch (code) {
      case ServiceCode.BAD_REQUEST:
        return HttpStatus.BAD_REQUEST;
      case ServiceCode.SERVER_ERROR:
        return HttpStatus.INTERNAL_SERVER_ERROR;
      default:
        return HttpStatus.OK;
    }
  };
}
