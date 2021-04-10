import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from '../config/app';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
import { HttpExceptionFilter } from './common/filters/exception/HttpException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true, // allow access origin
  });
  const ENV = process.env.NODE_ENV;
  const { port, addr, prefix, docs } = appConfig;
  app.setGlobalPrefix(prefix);
  app.useGlobalFilters(new HttpExceptionFilter())

  app.use(helmet());
  // app.use(csurf());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  await app.listen(port, addr, () => {
    if (ENV !== 'production') {
      console.log(`server is running at http://${addr}:${port}${prefix}`);
    }
  });
}
bootstrap();
