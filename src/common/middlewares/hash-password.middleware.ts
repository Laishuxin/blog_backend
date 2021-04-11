/* src/common/middlewares/hash-password.middleware.ts */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import CreateUserDto from 'src/modules/user/dto/CreateUserDto';
import { encryptPassword, makeSalt } from 'src/utils/cryptogram';

@Injectable()
export class HashPasswordMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const body: CreateUserDto = req.body;
    // User may want to find the password he forgot,
    // so if password not passed, skip to encrypt.
    const salt = body.password_salt ? body.password_salt : makeSalt();
    body.password = encryptPassword(body.password, salt);
    body.password_salt = salt;

    next();
  }
}
