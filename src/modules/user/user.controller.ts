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
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RestFulApi, SuccessStatus } from 'src/api/restful';
import { User, UserSchema } from './classes/User';
import CreateUserDto from './dto/CreateUserDto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  // TODO(rushui 2021-04-11): to be not accessible
  @Get(':username')
  @ApiTags('get')
  @ApiParam({
    name: 'username',
    description: 'Get user information by username',
    type: String,
    example: 'Foo',
  })
  @ApiResponse({
    description:
      'Return user information if success, else data will be set null',
    status: 200,
    type: User,
  })
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<RestFulApi<User | null>> {
    const result = await this.usersService.findOneByUsername(username);

    if (result === undefined) {
      throw new NotFoundException({ message: 'user not found' });
    }

    if (result.password) delete result.password;
    if (result.password_salt) delete result.password_salt;

    return {
      status: HttpStatus.OK,
      success: SuccessStatus.SUCCESS,
      data: result,
      message: 'success',
    };
  }

  // TODO(rushui 2021-04-10): add api document
  @Post('register')
  @ApiTags('post')
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserSchema
  })
  async register(@Body() body: CreateUserDto): Promise<RestFulApi<User>> {
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
      throw new InternalServerErrorException(result.message);

    const user = await this.usersService.findOneByUsername(username);
    if (user.password) delete user.password;
    if (user.password_salt) delete user.password_salt;

    return {
      status: result.status,
      success,
      data: user,
      message: result.message,
    };
  }
}
