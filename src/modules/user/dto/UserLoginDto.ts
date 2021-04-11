import { ApiProperty } from "@nestjs/swagger";

export default class UserLoginDto {
  @ApiProperty({
    description: 'Username',
    maxLength: 32,
    example: 'Xiaoming',
    required: true,
  })
  readonly username: string;

  @ApiProperty({
    description: 'User account password',
    minLength: 6,
    maxLength: 32,
    required: true,
    example: 'userPassword',
  })
  readonly password: string;
}