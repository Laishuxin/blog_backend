/* src/common/filters/exception/HttpException.filter.ts */

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RestFulApi, SuccessStatus } from 'src/api/restful';
import {
  loggingRequest,
  loggingResponseDataWithRequest,
} from 'src/utils/logging_util';
import { getLogger } from '../../../utils/logger';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  private static readonly responseLogger = getLogger('httpResponse');
  private static readonly requestLogger = getLogger('httpRequest');
  private static readonly errorLogger = getLogger('error');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();
    const status = exception.getStatus();

    if (status < 500) {
      loggingRequest(request, {
        level: 'info',
        logger: HttpExceptionFilter.requestLogger,
        hiddenFields: ['password', 'token'],
      });
    } else {
      loggingRequest(request, {
        level: 'error',
        logger: HttpExceptionFilter.errorLogger,
        hiddenFields: ['password', 'token'],
      });
    }

    const responseJson: RestFulApi = {
      status,
      data: null,
      message: exception.message,
      success: SuccessStatus.ERROR,
    };
    response.json(responseJson);
  }
}
