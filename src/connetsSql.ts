import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@ApiTags('sql')
@Controller('sql')
export class CqlController {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  @Get()
  async getHello() {
    const res = await this.dataSource.query(`
    SELECT "id"
    FROM "users"
    `);
    console.log(res);
    return `hello SQl + ${res[0].id}`;
  }
}
