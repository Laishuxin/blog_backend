import { HttpStatus, Injectable } from '@nestjs/common';
import { insert, query } from 'src/database';
import { UserAuthDefault, UserFields } from '.';
import { User, UserDao } from './class/User';
import CreateUserDto from './dto/CreateUserDto';
import {UserDaoFields, } from './dao/user.dao'

export interface ServiceResponse<T = any> {
  data?: T;
  status: HttpStatus;
  message: string;
  success: boolean;
}

@Injectable()
export class UserService {
  // TODO(rushui 2021-04-11): to be private method
  /**
   * Find one user by indicating username
   * @param username user name
   * @warn password_salt should be deleted after validating.
   * @returns user_id, create_at, update_at, username, nickname, password_salt, auth, email.
   */
  public async findOneByUsername(username: string): Promise<UserDao | undefined> {
    
    const sql = `
      SELECT ${UserDaoFields.userId}, ${UserDaoFields.createAt},
        ${UserDaoFields.updateAt}, ${UserDaoFields.username},
        ${UserDaoFields.nickname}, ${UserDaoFields.passwordSalt},
        ${UserDaoFields.auth}, ${UserDaoFields.email}, ${UserDaoFields.password}
      FROM t_user 
      WHERE ${UserDaoFields.username} = '${username}'
    `;

    let result = await query<UserDao>(sql);
    return result.length !== 0
      ? Promise.resolve(result[0])
      : Promise.resolve(undefined);
  }

  /**
   * User register.
   * @param userDto Create user dto.
   * @returns Ok or INTERNAL_SERVER_ERROR
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
        ${UserFields.userId}, ${UserFields.username},
        ${UserFields.nickname}, ${UserFields.password},
        ${UserFields.passwordSalt}, ${UserFields.auth},
        ${UserFields.email}, ${UserFields.avatar}
      )
      VALUES
      (UUID(), '${username}', '${nickname}', '${password}', '${password_salt}', ${auth}, '${email}', '${avatar}');
    `;

    // TODO(rushui 2021-04-10): close logging
    const message = await insert(sql, { logging: true });
    return message === null
      ? { status: HttpStatus.OK, message: 'success', success: true }
      : { status: HttpStatus.INTERNAL_SERVER_ERROR, message, success: false };
  }
}
