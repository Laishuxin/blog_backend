import { HttpStatus, Injectable } from '@nestjs/common';
import { insert, query } from 'src/database';
import { UserAuthDefault, UserFields } from '.';
import { User, UserDao } from './classes/User';
import CreateUserDto from './dto/CreateUserDto';

@Injectable()
export class UserService {
  // TODO(rushui 2021-04-11): to be private method
  /**
   * Find one user by indicating username
   * @param username user name
   * @warn password_salt should be deleted after validating.
   * @returns user_id, create_at, update_at, username, nickname, password_salt, auth, email.
   */
  async findOneByUsername(username: string): Promise<UserDao | undefined> {
    // return `${username} welcome!`;
    const sql = `
      SELECT ${UserFields.userId}, ${UserFields.createAt},
        ${UserFields.updateAt}, ${UserFields.username},
        ${UserFields.nickname}, ${UserFields.passwordSalt},
        ${UserFields.auth}, ${UserFields.email}, ${UserFields.password}
      FROM t_user 
      WHERE ${UserFields.username} = '${username}'
    `;

    const result = await query<UserDao>(sql);
    return result.length !== 0
      ? Promise.resolve(result[0])
      : Promise.resolve(undefined);
  }

  /**
   * User register.
   * @param userDto Create user dto.
   * @returns Ok or INTERNAL_SERVER_ERROR
   */
  async createUser(
    userDto: CreateUserDto,
  ): Promise<{ status: HttpStatus; message: string }> {
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
    if (user) return { status: HttpStatus.BAD_REQUEST, message: 'user exists' };

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
      ? { status: HttpStatus.OK, message: 'success' }
      : { status: HttpStatus.INTERNAL_SERVER_ERROR, message };
  }
}
