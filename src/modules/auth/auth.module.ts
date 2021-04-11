/* src/modules/auth/auth.module.ts */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
// import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn:jwtConstants.expiresIn
      }
    }),
    // UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
