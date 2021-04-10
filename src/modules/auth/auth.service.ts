import { HttpStatus, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { RestFulApi, SuccessStatus } from 'src/api/restful';
import { validate } from 'src/utils/cryptogram';
import { User } from '../user/classes/User';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { Payload } from './payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<RestFulApi<UserModule | null>> {
    const user = await this.usersService.findOneByUsername(username);
    if (user === undefined) {
      return {
        status: HttpStatus.NOT_FOUND,
        success: SuccessStatus.ERROR,
        data: null,
        message: 'user not fount',
      };
    }

    const { password: hashedPassword, password_salt } = await user;
    const ok = validate(password, password_salt, hashedPassword);
    if (ok) {
      if (user.password_salt) delete user.password_salt;
      if (user.password) delete user.password;
      return {
        status: HttpStatus.OK,
        success: SuccessStatus.SUCCESS,
        data: user,
        message: 'validate user success',
      };
    }
    return {
      status: HttpStatus.FORBIDDEN,
      success: SuccessStatus.ERROR,
      data: null,
      message: 'password error',
    };
  }

  async certificate(user: User): Promise<RestFulApi> {
    const payload: Payload = {
      sub: user.userId,
      username: user.username,
      nickname: user.nickname,
      auth: user.auth,
    };
    console.log('jWT validating...');
    try {
      const token = this.jwtService.sign(payload);
      return {
        status: HttpStatus.OK,
        success: SuccessStatus.SUCCESS,
        data: { token },
        message: 'login success',
      };
    } catch (err) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        success: SuccessStatus.ERROR,
        data: null,
        message: err.message,
      };
    }
  }
}
