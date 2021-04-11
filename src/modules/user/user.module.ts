/* src/modules/user.module.ts */


import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HashPasswordMiddleware } from 'src/common/middlewares/hash-password.middleware';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HashPasswordMiddleware).forRoutes('user');
  }
}
