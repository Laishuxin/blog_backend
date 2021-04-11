import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export enum SuccessStatus {
  SUCCESS = 1,
  ERROR = 0,
}

export class RestFulApi<T = any> {
  @ApiProperty({
    description: 'http status',
    examples: [HttpStatus.OK, HttpStatus.NOT_FOUND],
    enum: HttpStatus,
  })
  status: HttpStatus;

  @ApiProperty({
    description:
      'The request is success or not. 0: occur some errors, 1: success',
    type: Number,
    examples: [0, 1],
  })
  success: SuccessStatus;

  @ApiProperty({
    description: 'Response data.',
    nullable: true,
    example: 'null',
  })
  data: T;

  @ApiProperty({
    description: 'Response message.',
    examples: ['success', 'user not found'],
  })
  message: string;
}
