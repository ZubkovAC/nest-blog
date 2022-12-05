import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Ip,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Request, Response } from 'express';
import { BodyCreateUserType } from '../users/users.controller';
import { AuthBaseGuard } from '../guards/AuthBase.guard';
import { Model } from 'mongoose';
import { UsersSchemaInterface } from '../users/users.schemas';
import { IsBoolean, Length } from 'class-validator';
import { BlogsService } from '../blogs/blogs.service';

class BanValue {
  @IsBoolean()
  isBanned: boolean;
  @Length(1, 20)
  banReason: string;
}

@ApiTags('Super Admin')
@Controller('sa')
export class SuperAdminController {
  constructor(
    protected usersService: UsersService,
    protected blogsService: BlogsService,
    @Inject('USERS_MODEL')
    private usersRepository: Model<UsersSchemaInterface>,
  ) {}
  @ApiBasicAuth()
  @UseGuards(AuthBaseGuard)
  @Get('users')
  async getUsers(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Query('searchLoginTerm') searchLoginTerm: string,
    @Query('searchEmailTerm') searchEmailTerm: string,
    @Query('banStatus') banStatus: string,
  ) {
    return this.usersService.getUsers(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
      banStatus,
    );
  }
  @ApiBasicAuth()
  @UseGuards(AuthBaseGuard)
  @Post('users')
  async createUser(
    @Body() bodyCreateUser: BodyCreateUserType,
    @Req() req: Request,
    @Ip() ip,
  ) {
    const login = await this.usersRepository.findOne({
      'accountData.login': bodyCreateUser.login,
    });
    const email = await this.usersRepository.findOne({
      'accountData.email': bodyCreateUser.email,
    });
    if (login || email) {
      const error = [];
      if (login) {
        error.push('login is repeated');
      }
      if (email) {
        error.push('email is repeated');
      }
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
    const title = req.headers['user-agent'];
    return this.usersService.createUser(bodyCreateUser, ip, title);
  }
  @ApiBasicAuth()
  @UseGuards(AuthBaseGuard)
  @Put('users/:id/ban')
  async banUser(@Body() banValue: BanValue, @Param('id') id: string) {
    const user = await this.usersRepository.findOne({
      'accountData.userId': id,
    });
    if (!user) {
      throw new HttpException({ message: ['postId'] }, HttpStatus.NOT_FOUND);
    }
    const date = new Date().toISOString();
    await this.usersRepository.updateOne(
      { 'accountData.userId': id },
      {
        $set: {
          banInfo: {
            isBanned: banValue.isBanned,
            banDate: date,
            banReason: banValue.banReason,
          },
        },
      },
    );
    return;
  }
  @UseGuards(AuthBaseGuard)
  @ApiBasicAuth()
  @HttpCode(204)
  @Delete('users/:id')
  async deleteUser(@Param('id') deleteUser: string) {
    const userId = await this.usersRepository.findOne({
      'accountData.userId': deleteUser,
    });
    if (!userId) {
      throw new NotFoundException('not found');
    }
    return this.usersService.deleteUser(deleteUser);
  }
  @UseGuards(AuthBaseGuard)
  @ApiBasicAuth()
  @Get('blogs')
  getBlogs(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('searchNameTerm') searchNameTerm: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
  ) {
    return this.blogsService.getBlogs(
      pageNumber,
      pageSize,
      searchNameTerm,
      sortBy,
      sortDirection,
    );
  }
  @UseGuards(AuthBaseGuard)
  @ApiBasicAuth()
  @Put('blogs/:id/bind-with-user/:userId')
  bindBlogs() {
    return 'blogs/:id/bind-with-user/:userId';
  }
}
