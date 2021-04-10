import { HttpStatus } from '@nestjs/common';

export enum SuccessStatus {
  SUCCESS = 1,
  ERROR = 0,
}

export interface RestFulApi<T = any> {
  status: HttpStatus;
  success: SuccessStatus;
  data: T;
  message: string;
}
