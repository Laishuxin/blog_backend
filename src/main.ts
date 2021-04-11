/* src/main.ts */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from '../config/app';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
import { HttpExceptionFilter } from './common/filters/exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true, // allow access origin
  });
  const ENV = process.env.NODE_ENV;
  const { port, addr, prefix, docs } = appConfig;
  app.setGlobalPrefix(prefix);
  app.useGlobalFilters(new HttpExceptionFilter());

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
  SwaggerModule.setup(`${prefix}/${docs}`, app, document);
  // end swagger

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
      console.log(
        `document server is running at http://${addr}:${port}${prefix}/${docs}`,
      );
    }
  });
}
bootstrap();
