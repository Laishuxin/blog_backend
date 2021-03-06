// src/logical/auth/jwt.strategy.ts

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UserAuthEnum } from '../user';

export interface Payload {
  sub: string;
  username: string;
  nickname: string;
  auth: UserAuthEnum;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: Payload) {
    // console.log(`JWT验证 - Step 4: 被守卫调用`);
    return {
      userId: payload.sub,
      username: payload.username,
      realName: payload.nickname,
      auth: payload.auth,
    };
  }
}
