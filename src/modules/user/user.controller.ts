/* src/modules/user/user.controller.ts */

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RestFulApi, SuccessStatus } from 'src/api/restful';
import { UserAuthEnum } from '.';
import { User, UserSchema } from './class/User';
import CreateUserDto from './dto/CreateUserDto';
import { Role } from './role.decorator';
import { RoleGuard } from './role.guard';
import { UserService } from './user.service';

@ApiTags('user')
@ApiBearerAuth('jwt')
@ApiHeader({
  name: 'Authorization',
  description: 'Token',
  required: true,
  example:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTEyZTg2NS05YWE2LTExZWItYmVlZC0wMDUwNTZjMDAwMDEiLCJ1c2VybmFtZSI6ImFkbWluMTIzNDU2Iiwibmlja25hbWUiOiJ1c2VyX25pY2tuYW1lIiwiYXV0aCI6MSwiaWF0IjoxNjE4MTM3ODA2LCJleHAiOjE2MTgxNjY2MDZ9.VPUGWUecY-_osCFWcMJ8eeGcPRCK_nvWK3n4k01LeAI',
})
@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @ApiOperation({
    summary:
      'Get user information by username. If succeed return user information, else return null.',
  })
  @ApiParam({
    name: 'username',
    type: String,
  })
  @ApiResponse({
    description: 'User not found.',
    status: 404,
    type: RestFulApi,
  })
  @ApiResponse({
    description: 'Lacks token.',
    status: 403,
    type: RestFulApi,
  })
  @Get('get/:username')
  @Role(UserAuthEnum.ADMIN)
  @UseGuards(RoleGuard)
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<RestFulApi<User | null>> {
    const result = await this.usersService.findOneByUsername(username);
    if (result === undefined) {
      throw new NotFoundException({ message: 'user not found' });
    }

    const user = UserService.getUser(result);
    return {
      status: HttpStatus.OK,
      success: SuccessStatus.SUCCESS,
      data: user,
      message: 'success',
    };
  }

  @ApiOperation({
    summary: 'User register by admin.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserSchema,
  })
  @Post('register')
  @Role(UserAuthEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async register(
    @Body() body: CreateUserDto,
  ): Promise<RestFulApi<User>> {
    // console.log(body);
    const { username, nickname, password, email } = body;
    if (!username || !nickname || !password || !email) {
      throw new BadRequestException('parameter error');
    }

    const result = await this.usersService.createUser(body);
    const success =
      result.status >= 200 && result.status < 300
        ? SuccessStatus.SUCCESS
        : SuccessStatus.ERROR;

    if (success === SuccessStatus.ERROR)
      throw new BadRequestException(result.message);

    const user = UserService.getUser(
      await this.usersService.findOneByUsername(username),
    );

    return {
      status: result.status,
      success,
      data: user,
      message: result.message,
    };
  }
}
