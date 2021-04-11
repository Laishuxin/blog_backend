/* src/modules/user/user.controller.ts */

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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RestFulApi, SuccessStatus } from 'src/api/restful';
import { deleteProperties } from 'src/utils/object_property_utils';
import { UserAuthEnum } from '.';
import { User, UserSchema } from './class/User';
import CreateUserDto from './dto/CreateUserDto';
import { Role } from './role.decorator';
import { RoleGuard } from './role.guard';
import { UserService } from './user.service';

@ApiTags('user')
@ApiBearerAuth('jwt')
@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly usersService: UserService) {}

  // TODO(rushui 2021-04-11): to be not accessible
  @Get('get/:username')
  @ApiParam({
    name: 'username',
    description: 'Get user information by username',
    type: String,
    example: 'Foo',
    deprecated: true,
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
    deleteProperties(result, 'password', 'password_salt');

    return {
      status: HttpStatus.OK,
      success: SuccessStatus.SUCCESS,
      data: result,
      message: 'success',
    };
  }

  // TODO(rushui 2021-04-10): add api document
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

  // TODO(rushui 2021-04-11): delete
  @Get('test')
  @ApiOperation({
    summary: 'Testing guard',
  })
  test(): RestFulApi<string> {
    return {
      status: 200,
      message: 'testing success',
      data: null,
      success: 1,
    };
  }
}
