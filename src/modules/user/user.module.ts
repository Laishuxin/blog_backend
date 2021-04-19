/* src/modules/user.module.ts */

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HashPasswordMiddleware } from 'src/common/middlewares/hash-password.middleware';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [UserService, AuthService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HashPasswordMiddleware).forRoutes('user/register');
  }
}
