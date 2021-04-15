import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  loggingRequest,
  loggingResponse,
} from '../../utils/logging_util';
import { getLogger } from '../../utils/logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private static readonly requestLogger = getLogger('httpRequest');
  private static readonly responseLogger = getLogger('httpResponse');
  use(req: Request, res: Response, next: () => void) {
    const level = res.statusCode < 500 ? 'info' : 'error';

    loggingRequest(req, {
      level,
      logger: LoggerMiddleware.requestLogger,
      hiddenFields: ['password'],
      salt: `File name: ${__filename}`,
    });

    next();
    loggingResponse(req, res, {
      level,
      logger: LoggerMiddleware.responseLogger,
      hiddenFields: ['password', 'token'],
    });
  }
}
