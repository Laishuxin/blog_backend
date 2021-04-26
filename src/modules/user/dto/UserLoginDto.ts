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
    description: 'User encrypted password',
    minLength: 6,
    maxLength: 32,
    required: true,
    example: 'U2FsdGVkX19zc3PzPGowl13j2ama6q0bgzJhNOajT1U=',
    examples: ['U2FsdGVkX193/+6A+Trmm02hKLrxMuX9Z1gInoKLvxI=']
  })
  readonly password: string;
}
