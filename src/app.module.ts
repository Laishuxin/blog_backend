import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from 'nestjs-config';
import { AppController } from './app.controller';
import { resolve } from 'path';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
// import { LoggerMiddleware } from './common/middlewares/logger.middleware';

@Module({
  imports: [
    ConfigModule.load(resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
    UserModule,
    AuthModule,
  ],
  // TODO(rushui 2021-04-09): delete AppController if done
  controllers: [AppController],
  providers: [],
})
// export class AppModule implements NestModule {
  // configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('/');
  // }
// }
export class AppModule {}