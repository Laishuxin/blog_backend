import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RestFulApi, SuccessStatus } from 'src/api/restful';
import { UserModel } from 'src/database/models';
import { User } from './classes/User';
import CreateUserDto from './dto/CreateUserDto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get(':username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<RestFulApi<User | null>> {
    const result = await this.usersService.findOneByUsername(username);

    if (result === undefined) {
      throw new NotFoundException({ message: 'user not found' });
    }

    return {
      status: HttpStatus.OK,
      success: SuccessStatus.SUCCESS,
      data: getUser(result),
      message: 'success',
    };
  }

  // TODO(rushui 2021-04-10): add api document
  @Post('register')
  @ApiTags('post')
  async register(@Body() body: CreateUserDto): Promise<RestFulApi> {
    // console.log(body);
    const { username, nickname, password, email } = body;
    if (!username || !nickname || !password || !email) {
      throw new BadRequestException('parameter error');
    }

    const result = await this.usersService.register(body);
    const success =
      result.status >= 200 && result.status < 300
        ? SuccessStatus.SUCCESS
        : SuccessStatus.ERROR;

    if (success === SuccessStatus.ERROR)
      throw new InternalServerErrorException(result.message);

    return {
      status: result.status,
      success,
      data: null,
      message: result.message,
    };
  }
}

function getUser(userModel: UserModel): User {
  return {
    userId: userModel.user_id,
    createAt: userModel.create_at,
    updateAt: userModel.update_at,
    auth: userModel.auth as any,
    avatar: userModel.avatar,
    email: userModel.email,
    username: userModel.username,
    nickname: userModel.nickname,
  };
}
