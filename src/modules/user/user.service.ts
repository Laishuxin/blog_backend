import { HttpStatus, Injectable } from '@nestjs/common';
import sequelize, { insert, query } from 'src/database';
import { encryptPassword, makeSalt } from 'src/utils/cryptogram';
import {
  UserModel,
  UserFields,
  UserModelDefaults,
} from '../../database/models';
import CreateUserDto from './dto/CreateUserDto';

@Injectable()
export class UserService {
  /**
   * Find one user by indicating username
   * @param username user name
   * @warn password_salt should be deleted after validating.
   * @returns user_id, create_at, update_at, username, nickname, password_salt, auth, email.
   */
  async findOneByUsername(username: string): Promise<UserModel | undefined> {
    // return `${username} welcome!`;
    const sql = `
      SELECT ${UserFields.userId}, ${UserFields.createAt},
        ${UserFields.updateAt}, ${UserFields.username},
        ${UserFields.nickname}, ${UserFields.passwordSalt},
        ${UserFields.auth}, ${UserFields.email}
      FROM t_user 
      WHERE ${UserFields.username} = '${username}'
    `;

    const result = await query<UserModel>(sql);
    return result.length !== 0
      ? Promise.resolve(result[0])
      : Promise.resolve(undefined);
  }

  async register(
    userModel: CreateUserDto,
  ): Promise<{ status: HttpStatus; message: string }> {
    let { username, nickname, password, auth, email, avatar } = userModel;

    // To find whether user has existed. if true return handling.
    const user = await this.findOneByUsername(username);
    if (user) return { status: HttpStatus.BAD_REQUEST, message: 'user exists' };

    // Refactor parameter:
    //   - set default
    //   - encrypt password
    const salt = makeSalt();
    auth = avatar !== undefined ? auth : UserModelDefaults.auth;
    avatar = avatar !== undefined ? avatar : null;
    password = encryptPassword(password, salt);

    // Execute sql.
    const sql = `
      INSERT INTO t_user (
        ${UserFields.userId}, ${UserFields.username},
        ${UserFields.nickname}, ${UserFields.password},
        ${UserFields.passwordSalt}, ${UserFields.auth},
        ${UserFields.email}, ${UserFields.avatar}
      )
      VALUES
      (UUID(), '${username}', '${nickname}', '${password}', '${salt}', ${auth}, '${email}', '${avatar}');
    `;

    // TODO(rushui 2021-04-10): close logging
    const message = await insert(sql, { logging: true });
    return message === null
      ? { status: HttpStatus.OK, message: 'success' }
      : { status: HttpStatus.INTERNAL_SERVER_ERROR, message };
  }
}
