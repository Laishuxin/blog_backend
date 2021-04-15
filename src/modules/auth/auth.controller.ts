/* src/modules/auth/auth.controller.ts */

import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RestFulApi, SuccessStatus } from 'src/api/restful';
import { User } from '../user/class/User';
import UserLoginDto from '../user/dto/UserLoginDto';
import { AuthService } from './auth.service';
import { AuthSchema } from './class/Auth';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'User login',
  })
  @ApiResponse({
    description: 'Return user information and token if succeed.',
    type: AuthSchema,
    status: 200,
  })
  @Post('login')
  public async userLogin(
    @Body() userLoginDto: UserLoginDto,
  ): Promise<RestFulApi<{ info: User; token: string }>> {
    if (!userLoginDto.password || !userLoginDto.username) {
      throw new BadRequestException('lacks username or password');
    }

    const serviceResponse = await this.authService.login(userLoginDto);
    const success: boolean = serviceResponse.success;
    if (!success) {
      throw new HttpException(
        { message: serviceResponse.message },
        serviceResponse.status,
      );
    }

    const user = serviceResponse.data;

    return {
      status: serviceResponse.status,
      success: SuccessStatus.SUCCESS,
      message: serviceResponse.message,
      data: {
        info: user,
        token: await this.authService.certificate(user),
      },
    };
  }
}
