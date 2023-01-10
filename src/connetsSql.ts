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
    console.log('123');
    const res = await this.dataSource.query(`
    SELECT "id"
    FROM "users"
    `);
    console.log(res);
    return `hello SQl + ${res[0].id}`;
  }
}

// CREATE TABLE users (
//   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
//   "login" TEXT DEFAULT '' NOT NULL,
//   email TEXT DEFAULT '' NOT NULL,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
//   hash TEXT DEFAULT '' NOT NULL,
//   salt TEXT DEFAULT '' NOT NULL,
//   is_banned BOOLEAN DEFAULT false NOT NULL,
//   ban_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   ban_reason TEXT DEFAULT '',
//   conformation_code UUID DEFAULT NULL,
//   is_conformed BOOLEAN DEFAULT false NOT NULL,
//   expiration_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
// );
// CREATE TABLE devices_auth (
//   id UUID DEFAULT uuid_generate_v4() NOT NULL,
//   user_id UUID DEFAULT ihp_user_id() NOT NULL,
//   ip TEXT DEFAULT NULL,
//   access_password TEXT DEFAULT NULL,
//   refresh_password TEXT DEFAULT NULL,
//   exp_active TIMESTAMP WITH TIME ZONE DEFAULT NULL,
//   title TEXT DEFAULT NULL,
//   is_delete BOOLEAN DEFAULT false NOT NULL
// );
// CREATE INDEX devices_auth_user_id_index ON devices_auth (user_id);
// ALTER TABLE devices_auth ADD CONSTRAINT devices_auth_ref_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE NO ACTION;
// ALTER TABLE devices_auth ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Users can manage their devices_auth" ON devices_auth USING (user_id = ihp_user_id()) WITH CHECK (user_id = ihp_user_id());
