import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserAuthEnum } from '.';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx: Request = context.switchToHttp().getRequest();
    const role = this.reflector.get<UserAuthEnum>('role', context.getHandler());

    if (role === UserAuthEnum.ADMIN) {
      let token = ctx.headers['authorization'];
      // lacks token.
      if (!token) return false;

      // here token = 'Bearer eyJhb...', and we need to extract the real token
      token = token.split(' ')[1];
      if (!token) return false;

      // get the auth of user
      const payload = this.authService.decode(token);
      
      // TODO(rushui 2021-04-11): delete
      return payload.auth.toString() === '1'
    }
    return true;
  }
}
