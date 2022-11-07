import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiResponse,
  ApiTags,
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

@ApiTags('test-server')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  // @ApiResponse({
  //   status: 200,
  //   description: 'Hello World!!22!',
  // })
  // @ApiResponse({ status: 500, description: 'crash - server' })
  async getHello() {
    // return this.appService.getHello();
    const app = await NestFactory.create(AppModule);
    const config = await new DocumentBuilder()
      .setTitle('"Study, study and study again." @ Lenin')
      .setDescription('educational API description')
      .setVersion('1.0')
      .addTag('cats')
      .build();
    const document = await SwaggerModule.createDocument(app, config);
    return SwaggerModule.setup('api', app, document);
  }
}
