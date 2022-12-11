import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Ip,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Request } from 'express';
import { BodyCreateUserType } from '../users/users.controller';
import { AuthBaseGuard } from '../guards/AuthBase.guard';
import { Model } from 'mongoose';
import { UsersSchemaInterface } from '../users/users.schemas';
import { IsBoolean, Length } from 'class-validator';
import { BlogsService } from '../blogs/blogs.service';
import { PostsService } from '../posts/posts.service';
import { CommentsService } from '../comments/comments.service';
import { CommandBus } from '@nestjs/cqrs';
import { useGetSAUsers } from './useCases/getSA-users';
import { useGetSABlogs } from './useCases/getSA-blogs';
import { usePostSABlogs } from './useCases/postSA-users';
import { usePutSAUserIdBan } from './useCases/putSA-users-id-ban';
import { useDelSAUserId } from './useCases/delSA-users-id';

export class BanValue {
  @IsBoolean()
  isBanned: boolean;
  @Length(20, 120)
  banReason: string;
}

@ApiTags('Super Admin')
@Controller('sa')
export class SuperAdminController {
  constructor(
    protected commandBus: CommandBus, // protected usersService: UsersService, // protected blogsService: BlogsService, // @Inject('USERS_MODEL') // private usersRepository: Model<UsersSchemaInterface>, // protected postsService: PostsService, // protected commentsService: CommentsService,
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
    return this.commandBus.execute(
      new useGetSAUsers(
        banStatus,
        searchLoginTerm,
        searchEmailTerm,
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
      ),
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
    return this.commandBus.execute(new usePostSABlogs(ip, req, bodyCreateUser));
  }
  @ApiBasicAuth()
  @UseGuards(AuthBaseGuard)
  @HttpCode(204)
  @Put('users/:id/ban')
  async banUser(@Body() banValue: BanValue, @Param('id') id: string) {
    await this.commandBus.execute(new usePutSAUserIdBan(id, banValue));
    return;
  }
  @UseGuards(AuthBaseGuard)
  @ApiBasicAuth()
  @HttpCode(204)
  @Delete('users/:id')
  async deleteUser(@Param('id') deleteUser: string) {
    return this.commandBus.execute(new useDelSAUserId(deleteUser));
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
    return this.commandBus.execute(
      new useGetSABlogs(
        pageNumber,
        pageSize,
        searchNameTerm,
        sortBy,
        sortDirection,
      ),
    );
  }
  @UseGuards(AuthBaseGuard)
  @ApiBasicAuth()
  @Put('blogs/:id/bind-with-user/:userId')
  bindBlogs() {
    return 'blogs/:id/bind-with-user/:userId';
  }
}
