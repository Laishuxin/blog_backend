import { HttpStatus } from '@nestjs/common';

export enum ServiceCode {
  SUCCESS = 0,
  SERVER_ERROR = 1,
  BAD_REQUEST = 2,
}

export interface IServiceResponse<T = any> {
  data?: T;
  message: string;
  code: ServiceCode;
}
