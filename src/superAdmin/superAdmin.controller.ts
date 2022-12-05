import { ApiTags } from '@nestjs/swagger';
import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@ApiTags('Super Admin')
@Controller('sa')
export class SuperAdminController {
  @Get('users')
  async getUsers() {
    return 'superUsers';
  }
  @Post('users')
  async createUser() {
    return 'createUser';
  }
  @Put('users/:id/ban')
  async updateUser() {
    return 'updateUser';
  }
  @Delete('users/:id')
  async deleteUser() {
    return 'deleteUser';
  }
  @Get('blogs')
  getBlogs() {
    return 'this blogs';
  }
  @Put('blogs/:id/bind-with-user/:userId')
  bindBlogs() {
    return 'blogs/:id/bind-with-user/:userId';
  }
}
