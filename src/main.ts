import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // swagger
  const config = new DocumentBuilder()
    .setTitle('"Study, study and study again." @ Lenin')
    .setDescription('educational API description')
    .setVersion('1.0')
    // .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  await SwaggerModule.setup('/api-doc', app, document);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
