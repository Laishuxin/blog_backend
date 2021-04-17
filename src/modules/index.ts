export enum ServiceCode {
  SUCCESS = 0,
  SERVER_ERROR = 1,
  BAD_REQUEST = 2,
  UNAUTHORIZED = 3
}

export interface IServiceResponse<T = any> {
  data?: T;
  message: string;
  code: ServiceCode;
}
