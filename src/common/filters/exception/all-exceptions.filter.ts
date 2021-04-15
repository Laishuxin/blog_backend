import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { getLogger } from '../../../utils/logger';
import { RestFulApi } from 'src/api/restful';
import { loggingResponse } from 'src/utils/logging_util';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private static readonly errorLogger = getLogger('error');
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res: Response = ctx.getResponse();
    const req: Request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    loggingResponse(req, res, {
      level: 'error',
      logger: AllExceptionsFilter.errorLogger,
      salt: `Message: ${exception}`,
      hiddenFields: ['password', 'token'],
    });

    res.status(status).json({
      status,
      message: status < 500 ? 'client error' : 'server error',
      success: 0,
      data: null,
    } as RestFulApi);
  }
}
