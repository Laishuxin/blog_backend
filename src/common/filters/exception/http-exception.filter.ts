/* src/common/filters/exception/HttpException.filter.ts */

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { loggingRequest } from 'src/utils/logging_util';
import { getLogger } from '../../../utils/logger';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  private static readonly requestLogger = getLogger('httpRequest');
  private static readonly errorLogger = getLogger('error');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();
    let status = exception.getStatus();
    let message = exception.message;
    if (status < 100) {
      message = 'server error';
      status = 500;
    }

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

    const responseJson = {
      message,
    };
    response.status(status).json(responseJson);
  }
}
