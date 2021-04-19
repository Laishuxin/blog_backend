import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { getLogger } from '../../../utils/logger';
import { loggingResponse } from 'src/utils/logging_util';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private static readonly errorLogger = getLogger('error');
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res: Response = ctx.getResponse();
    const req: Request = ctx.getRequest();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string = 'Client error';
    if (status < 100 || status >= 500) {
      message = 'Server error';
      status = 500;
    }

    loggingResponse(req, res, {
      level: 'error',
      logger: AllExceptionsFilter.errorLogger,
      salt: `Message: ${exception}`,
      hiddenFields: ['password', 'token'],
    });

    // console.log('all exception status: ', status)
    res.status(status).json({
      message
    });
  }
}
