import { ApiProperty } from '@nestjs/swagger';

export enum SuccessStatus {
  SUCCESS = 1,
  ERROR = 0,
}

export class RestFulApi<T = any> {
  @ApiProperty({
    description: 'Http response status',
    example: 200,
  })
  status: number;

  @ApiProperty({
    description: 'Request is successful or not. 0: error, 1: success.',
    example: 1,
  })
  success: SuccessStatus;

  @ApiProperty({
    description: 'Response data.',
    nullable: true,
    example: null,
  })
  data?: T;

  @ApiProperty({
    description: 'Response message.',
    example: 'success',
  })
  message: string;
}
