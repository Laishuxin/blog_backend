/* src/common/filters/exception/HttpException.filter.ts */

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { RestFulApi, SuccessStatus } from 'src/api/restful';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const status = exception.getStatus();

    const responseJson: RestFulApi = {
      status,
      data: null,
      message: exception.message,
      success: SuccessStatus.ERROR,
    };
    response.json(responseJson);
  }
}
