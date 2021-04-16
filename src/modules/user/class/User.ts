import { ApiProperty } from '@nestjs/swagger';
import { UserAuthEnum } from '..';

export class User {
  @ApiProperty({
    description: 'User uuid',
    example: '8ad6214a-9a01-11eb-beed-005056c00001',
  })
  public readonly user_id: string;

  @ApiProperty({
    description: 'The user create time',
    example: '2021-04-10T16:48:37.000Z',
  })
  public readonly createAt: string;

  @ApiProperty({
    description: 'The user last update time',
    example: '2021-04-10T16:48:37.000Z',
  })
  public readonly updateAt: string;

  @ApiProperty({
    description: 'Username',
    maxLength: 32,
    example: 'Xiaoming',
    required: true,
  })
  public readonly username: string;

  @ApiProperty({
    description: 'User nickname',
    maxLength: 32,
    example: 'user_nickname',
    required: true,
  })
  public readonly nickname: string;

  @ApiProperty({
    description: 'The contact email',
    required: true,
    maxLength: 255,
    example: '123456@163.com',
  })
  public readonly email: string;

  @ApiProperty({
    description: 'User avatar url',
    required: false,
    default: null,
    maxLength: 255,
    example:
      'https://i2.hdslb.com/bfs/face/3b1ba3d9dbdbb9c4354ef0819865a4b352a3197b.jpg@96w_96h_1c.webp',
  })
  public readonly avatar: string;

  @ApiProperty({
    description: 'User authorization.',
    // enum: UserAuthEnum,
    required: false,
    default: () => UserAuthEnum.USER,
    example: UserAuthEnum.USER,
    type: Number,
  })
  public readonly auth: UserAuthEnum;
}

export class UserSchema {
  @ApiProperty()
  data: User;

  @ApiProperty()
  token: string;
}
