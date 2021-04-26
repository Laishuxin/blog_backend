/* src/modules/auth/auth.service.ts */

import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { validate } from 'src/utils/crypto_util';
import { IServiceResponse, ServiceCode } from '..';
import { UserAuthEnum } from '../user';
import { User } from '../user/class/user';
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
  ): Promise<IServiceResponse<User | null>> {
    const userDao = await this.usersService.findOneByUsername(
      userLoginDto.username,
    );
    if (userDao === undefined) {
      return {
        code: ServiceCode.UNAUTHORIZED,
        message: 'User not found',
      };
    }

    const { password: hashedPassword, password_salt } = userDao;
    const ok = validate(userLoginDto.password, password_salt, hashedPassword);
    if (!ok) {
      return {
        code: ServiceCode.UNAUTHORIZED,
        message: 'Password error',
      };
    }

    return {
      code: ServiceCode.SUCCESS,
      data: UserService.getUser(userDao),
      message: 'Success',
    };
  }

  async certificate(user: User): Promise<string> {
    const payload: Payload = {
      sub: user.userId,
      username: user.username,
      nickname: user.nickname,
      auth: user.auth,
    } as any;
    // console.log('jWT validating...');
    return this.jwtService.sign(payload);
  }

  decode(token: string): Payload | null {
    return this.jwtService.decode(token, {
      json: true,
    }) as Payload;
  }

  /**
   * Extract token from primitive tokejn
   * @param primitiveToken Primitive token like 'Bearer xxx'
   * @returns token
   */
  extractToken(primitiveToken: string): string | undefined {
    if (!primitiveToken) return;
    let token = primitiveToken.split(' ')[1];
    return token ? token : undefined;
  }

  async login(userDto: UserLoginDto) {
    return await this.validateUser(userDto);
  }

  validateUserId(userId: string, token: string): boolean {
    const payload = this.decode(token);
    return payload && payload.sub === userId;
  }

  validateAuth(auth: UserAuthEnum, token: string): boolean {
    const payload = this.decode(token);
    return payload && payload.auth === auth;
  }

  async validateUserByToken(token: string): Promise<User | null> {
    const payload = this.decode(token);
    if (!payload) return null;
    const result = await this.usersService.findOneByUserId(payload.sub);
    if (!result.data) return null;

    return UserService.getUser(result.data);
  }

  public static getStatusByServiceCode(code: ServiceCode): HttpStatus {
    switch (code) {
      case ServiceCode.BAD_REQUEST:
        return HttpStatus.BAD_REQUEST;
      case ServiceCode.UNAUTHORIZED:
        return HttpStatus.UNAUTHORIZED;
      case ServiceCode.SERVER_ERROR:
        return HttpStatus.INTERNAL_SERVER_ERROR;
      default:
        return HttpStatus.OK;
    }
  }
}
