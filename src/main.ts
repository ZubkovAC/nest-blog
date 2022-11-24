import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception.filter';
import cookieParser from 'cookie-parser';
import {
  signUpRequestLimit,
  signUpRequestLimitRC,
  signUpRequestLimitRegistration,
  signUpRequestLimitRER,
} from './rate-limit/rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  // swagger
  const config = new DocumentBuilder()
    .addSecurity('basic', {
      type: 'http',
      scheme: 'basic',
    })
    .addBearerAuth()
    .setTitle('"Study, study and study again." @ Lenin')
    .setDescription('educational API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  app.use('/auth/login', signUpRequestLimit);
  app.use('/auth/registration', signUpRequestLimitRegistration);
  app.use('/auth/registration-confirmation', signUpRequestLimitRC);
  app.use('/auth/registration-email-resending', signUpRequestLimitRER);

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
