/* src/modules/auth/auth.service.ts */

import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { validate } from 'src/utils/cryptogram';
import { User } from '../user/class/User';
import UserLoginDto from '../user/dto/UserLoginDto';
import { UserService } from '../user/user.service';
import { Payload } from './jwt.strategy';
export interface ServiceResponse<T = any> {
  status: HttpStatus;
  success: boolean;
  data?: null | T;
  message: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService, // private readonly jwtService: JwtService,
  ) {}

  private async validateUser(
    userLoginDto: UserLoginDto,
  ): Promise<ServiceResponse<User | null>> {
    const userDao = await this.usersService.findOneByUsername(
      userLoginDto.username,
    );
    if (userDao === undefined) {
      return {
        status: HttpStatus.NOT_FOUND,
        success: false,
        message: 'user not found',
      };
    }

    const { password: hashedPassword, password_salt } = userDao;
    const ok = validate(userLoginDto.password, password_salt, hashedPassword);
    if (!ok) {
      return {
        status: HttpStatus.FORBIDDEN,
        success: false,
        message: 'password error',
      };
    }

    return {
      status: HttpStatus.OK,
      success: true,
      data: UserService.getUser(userDao),
      message: 'validation pass',
    };
  }

  async certificate(user: User): Promise<string> {
    const payload: Payload = {
      sub: user.user_id,
      username: user.username,
      nickname: user.nickname,
      auth: user.auth,
    } as any;
    // console.log('jWT validating...');
    return this.jwtService.sign(payload);
  }

  decode(token: string): Payload {
    return this.jwtService.decode(token, {
      json: true,
    }) as Payload;
  }

  async login(userDto: UserLoginDto) {
    return await this.validateUser(userDto);
  }
}
