/* src/main.ts */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from '../config/app';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import * as express from 'express';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/exception/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/exception/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true, // allow access origin
  });
  const { port, addr, prefix, docs } = appConfig;
  app.setGlobalPrefix(prefix);
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());
  // app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionsFilter());

  // swagger
  const options = new DocumentBuilder()
    .setTitle('Blog api document')
    .setDescription('My personal blog api document')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'jwt',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${docs}`, app, document);
  // end swagger

  // middlewares
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // app.use(csurf());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  // end middlewares

  await app.listen(port, addr, () => {
    console.log(`server is running at http://${addr}:${port}${prefix}`);
    console.log(
      `document server is running at http://${addr}:${port}${docs}`,
    );
  });
}
bootstrap();
