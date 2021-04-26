/* src/modules/user/user.controller.ts */

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserAuthEnum } from '.';
import { ServiceCode } from '..';
import { User } from './class/user';
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
  example: 'Bearer eyJhbGciOiJIxxxxxx',
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
  @Get('detail/:username')
  @Role(UserAuthEnum.ADMIN)
  @UseGuards(RoleGuard)
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<User | null> {
    const result = await this.usersService.findOneByUsername(username);
    if (result === undefined) {
      throw new NotFoundException({ message: 'user not found' });
    }

    const user = UserService.getUser(result);
    return user;
  }

  @ApiOperation({
    summary: 'User register by admin.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
  })
  @Post('register')
  @Role(UserAuthEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async create(
    @Body() body: CreateUserDto,
    @Res() res: Response<User>,
  ): Promise<User> {
    // console.log(body);
    const { username, nickname, password, email } = body;
    if (!username || !nickname || !password || !email) {
      throw new BadRequestException('parameter error');
    }

    const { code, message } = await this.usersService.create(body);

    const status = UserService.getStatusByServiceCode(code);

    if (code !== ServiceCode.SUCCESS) {
      throw new HttpException(message, status);
    }

    const user = UserService.getUser(
      await this.usersService.findOneByUsername(username),
    );

    res.status(status).json(user);
    return user;
  }
}
