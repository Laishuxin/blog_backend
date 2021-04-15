import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import {
  loggingRequest,
  loggingResponse,
  loggingResponseDataWithRequest,
} from '../../utils/logging_util';
import { getLogger } from 'src/utils/logger';

export interface Response<T = any> {
  status: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  private static readonly requestLogger = getLogger('httpRequest');
  private static readonly responseLogger = getLogger('httpResponse');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req: ExpressRequest = ctx.getRequest();
    const res: ExpressResponse = ctx.getResponse();
    const status = res.statusCode;
    const level = status < 500 ? 'info' : 'error';

    loggingRequest(req, {
      level,
      logger: TransformInterceptor.requestLogger,
      // hiddenFields: ['password'],
    });

    return next.handle().pipe(
      map((data: Response) => {
        loggingResponse(req, res, {
          logger: TransformInterceptor.responseLogger,
          level,
          // hiddenFields: ['token', 'password'],
          salt: `Response data: ${JSON.stringify(data, null, 0)}`,
        });
        return data;
      }),
    );
  }
}
