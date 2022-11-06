import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

// @ApiTags('test-server')
// @Controller()
// export class AppController {
//   constructor(private readonly appService: AppService) {}
//   @Get()
//   @ApiResponse({
//     status: 200,
//     description: 'Hello World!!22!',
//   })
//   @ApiResponse({ status: 500, description: 'crash - server' })
//   getHello(): string {
//     return this.appService.getHello();
//   }
// }
