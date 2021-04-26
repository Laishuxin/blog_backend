/* src/modules/auth/auth.controller.ts */

import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { decrypt } from 'src/utils/crypto_util';
import { ServiceCode } from '..';
import { User, UserSchema } from '../user/class/user';
import UserLoginDto from '../user/dto/UserLoginDto';
import { AuthService } from './auth.service';
import ValidateTokenDto from './dto/ValidateTokenDto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'User login',
  })
  @ApiResponse({
    description: 'Return user information and token.',
    status: 200,
    type: UserSchema,
  })
  @Post('account')
  public async userLogin(
    @Body() userLoginDto: UserLoginDto,
    @Res() req: Response<{ data: User; token: string }>,
  ): Promise<User> {
    if (!userLoginDto.password || !userLoginDto.username) {
      throw new BadRequestException('username or password require');
    }

    const { code, message, data = null } = await this.authService.login(
      {
        username: userLoginDto.username,
        password: decrypt(userLoginDto.password),
      },
      // { username: userLoginDto.username, password: userLoginDto.password },
    );
    const status = AuthService.getStatusByServiceCode(code);
    if (code !== ServiceCode.SUCCESS) {
      throw new HttpException(message, status);
    }

    req.status(status).json({
      data,
      token: await this.authService.certificate(data),
    });
    return data;
  }

  @ApiOperation({
    summary: 'Validate token.',
  })
  @ApiBody({
    required: true,
    type: ValidateTokenDto,
  })
  @Post('validate')
  public async validateToken(
    @Body('token') token: string,
  ): Promise<User | null> {
    // token = this.authService.extractToken(token);
    if (!token) throw new UnauthorizedException();

    const user = await this.authService.validateUserByToken(token);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
