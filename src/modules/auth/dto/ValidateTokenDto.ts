import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export default class ValidateTokenDto {
  @ApiProperty({
    description: 'token',
    required: true,
    example: 'xxx'
  })
  @IsString()
  token: string;
  
}
