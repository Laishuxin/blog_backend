/* src/modules/auth/auth.controller.ts */

import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ServiceCode } from '..';
import { User, UserSchema } from '../user/class/User';
import UserLoginDto from '../user/dto/UserLoginDto';
import { AuthService } from './auth.service';

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
    type: UserSchema
  })
  @Post('login')
  public async userLogin(
    @Body() userLoginDto: UserLoginDto,
    @Res() req: Response<{ data: User; token: string }>,
  ): Promise<User> {
    if (!userLoginDto.password || !userLoginDto.username) {
      throw new BadRequestException('username or password require');
    }

    // TODO delete
    const { code, message, data = null } = await this.authService.login(
      userLoginDto,
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
}
