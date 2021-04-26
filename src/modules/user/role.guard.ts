import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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
      let token = ctx.headers['Authorization'] as string;
      // lacks token.
      if (!token) return false;

      // console.log(token);
      // here token = 'Bearer eyJhb...', and we need to extract the real token
      token = this.authService.extractToken(token)
      if (!token) return false;

      // console.log(payload);
      return this.authService.validateAuth(role, token)
    }
    return true;
  }
}

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTEyZTg2NS05YWE2LTExZWItYmVlZC0wMDUwNTZjMDAwMDEiLCJ1c2VybmFtZSI6ImFkbWluMTIzNDU2Iiwibmlja25hbWUiOiJ1c2VyX25pY2tuYW1lIiwiYXV0aCI6MSwiaWF0IjoxNjE4MTM3ODA2LCJleHAiOjE2MTgxNjY2MDZ9.VPUGWUecY-_osCFWcMJ8eeGcPRCK_nvWK3n4k01LeAI
