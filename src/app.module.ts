import { Module } from '@nestjs/common';
import { ConfigModule } from 'nestjs-config';
import { AppController } from './app.controller';
import { resolve } from 'path';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.load(resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
    UserModule,
  ],
  // TODO(rushui 2021-04-09): delete AppController if done
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
