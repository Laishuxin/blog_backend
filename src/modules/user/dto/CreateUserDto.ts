import { ApiProperty } from '@nestjs/swagger';
import { UserAuthEnum } from '..';
import { IsEmail, IsString } from 'class-validator';

export default class CreateUserDto {
  @ApiProperty({
    description: 'Username',
    maxLength: 32,
    example: 'Xiaoming',
    required: true,
  })
  @IsString()
  readonly username: string;

  @ApiProperty({
    description: 'User nickname',
    maxLength: 32,
    example: 'user_nickname',
    required: true,
  })
  @IsString()
  readonly nickname: string;

  @ApiProperty({
    description: 'User account password',
    minLength: 6,
    maxLength: 32,
    required: true,
    example: 'userPassword',
  })
  password: string;

  @ApiProperty({
    description: 'User authorization.',
    enum: UserAuthEnum,
    type: Number,
    required: false,
    default: () => UserAuthEnum.USER,
    example: UserAuthEnum.USER,
  })
  readonly auth: UserAuthEnum;

  @ApiProperty({
    description: 'The contact email',
    required: true,
    maxLength: 255,
    example: '123456@163.com',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'User avatar url',
    required: false,
    default: null,
    maxLength: 255,
    example:
      'https://i2.hdslb.com/bfs/face/3b1ba3d9dbdbb9c4354ef0819865a4b352a3197b.jpg@96w_96h_1c.webp',
  })
  readonly avatar: string | null;

  @ApiProperty({
    description: 'password salt',
    example: '123456',
    minLength: 0,
    maxLength: 6,
    required: false,
  })
  password_salt?: string;
}
