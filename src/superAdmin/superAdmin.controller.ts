import {
  ApiBasicAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Ip,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { BodyCreateUserType } from '../users/users.controller';
import { AuthBaseGuard } from '../guards/AuthBase.guard';
import { IsBoolean, Length } from 'class-validator';
import { CommandBus } from '@nestjs/cqrs';
import { useGetSAUsers } from './useCases/getSA-users';
import { useGetSABlogs } from './useCases/getSA-blogs';
import { usePostSABlogs } from './useCases/postSA-users';
import { usePutSAUserIdBan } from './useCases/putSA-users-id-ban';
import { useDelSAUserId } from './useCases/delSA-users-id';
import { usePutSABlogsIdBan } from './useCases/putSA-blogs-id-ban';

export class BanValue {
  @IsBoolean()
  isBanned: boolean;
  @Length(20, 120)
  banReason: string;
}
export class isBanned {
  @IsBoolean()
  isBanned: boolean;
}

@ApiTags('Super Admin')
@Controller('sa')
export class SuperAdminController {
  constructor(protected commandBus: CommandBus) {}
  @ApiBasicAuth()
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiQuery({
    name: 'banStatus',
    required: false,
    type: 'all || banned || notBanned',
  })
  @ApiQuery({ name: 'searchLoginTerm', required: false, type: String })
  @ApiQuery({ name: 'searchEmailTerm', required: false, type: String })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'pageNumber', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: 'params Object' })
  @ApiQuery({ name: 'sortDirection', required: false, type: 'asc || desc' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      example: {
        pagesCount: 0,
        page: 0,
        pageSize: 0,
        totalCount: 0,
        items: [
          {
            id: 'string',
            login: 'string',
            email: 'string',
            createdAt: '2022-12-12T17:49:24.472Z',
            banInfo: {
              isBanned: true,
              banDate: '2022-12-12T17:49:24.472Z',
              banReason: 'string',
            },
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'If the inputModel has incorrect values',
    schema: {
      example: {
        errorsMessages: [
          {
            message: 'string',
            field: 'string',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
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
  @ApiBody({
    schema: {
      example: {
        login: 'string',
        password: 'string',
        email: 'string',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    schema: {
      example: {
        id: 'string',
        login: 'string',
        email: 'string',
        createdAt: '2022-12-12T17:54:37.400Z',
        banInfo: {
          isBanned: true,
          banDate: '2022-12-12T17:54:37.400Z',
          banReason: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'If the inputModel has incorrect values',
    schema: {
      example: {
        errorsMessages: [
          {
            message: 'string',
            field: 'string',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(AuthBaseGuard)
  @Post('users')
  async createUser(
    @Body() bodyCreateUser: BodyCreateUserType,
    @Req() req: Request,
    @Ip() ip,
  ) {
    return this.commandBus.execute(new usePostSABlogs(ip, req, bodyCreateUser));
  }
  @ApiBody({
    schema: {
      example: {
        isBanned: 'true || false',
        banReason: 'string minLength: 20',
      },
    },
  })
  @ApiResponse({
    status: 204,
    description: 'No Content',
  })
  @ApiResponse({
    status: 400,
    description: 'If the inputModel has incorrect values',
    schema: {
      example: {
        errorsMessages: [
          {
            message: 'string',
            field: 'string',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBasicAuth()
  @UseGuards(AuthBaseGuard)
  @HttpCode(204)
  @Put('users/:id/ban')
  async banUser(@Body() banValue: BanValue, @Param('id') id: string) {
    await this.commandBus.execute(new usePutSAUserIdBan(id, banValue));
    return;
  }
  @ApiResponse({
    status: 204,
    description: 'No Content',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'not found postId',
  })
  @UseGuards(AuthBaseGuard)
  @ApiBasicAuth()
  @HttpCode(204)
  @Delete('users/:id')
  async deleteUser(@Param('id') deleteUser: string) {
    return this.commandBus.execute(new useDelSAUserId(deleteUser));
  }

  @ApiQuery({ name: 'searchNameTerm', required: false, type: String })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'pageNumber', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: 'params Object' })
  @ApiQuery({ name: 'sortDirection', required: false, type: 'asc || desc' })
  @ApiResponse({
    status: 200,
    description: 'No Content',
    schema: {
      example: {
        pagesCount: 0,
        page: 0,
        pageSize: 0,
        totalCount: 0,
        items: [
          {
            id: 'string',
            name: 'string',
            description: 'string',
            websiteUrl: 'string',
            createdAt: '2022-12-12T17:58:21.002Z',
            blogOwnerInfo: {
              userId: 'string',
              userLogin: 'string',
            },
            banInfo: {
              isBanned: true,
              banDate: '2022-12-12T17:58:21.002Z',
            },
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(AuthBaseGuard)
  @ApiBasicAuth()
  @Get('blogs')
  getBlogs(
    @Query('searchNameTerm') searchNameTerm: string,
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
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
  @ApiBody({
    schema: {
      example: {
        isBanned: 'true || false -boolean',
      },
    },
  })
  @ApiResponse({
    status: 204,
    description: 'No Content',
  })
  @ApiResponse({
    status: 400,
    description: 'If the inputModel has incorrect values',
    schema: {
      example: {
        errorsMessages: [
          {
            message: 'string',
            field: 'string',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @HttpCode(204)
  @UseGuards(AuthBaseGuard)
  @ApiBasicAuth()
  @Put('blogs/:id/ban')
  updateIdBanBlog(@Param('id') id: string, @Body() isBanned: isBanned) {
    return this.commandBus.execute(
      new usePutSABlogsIdBan(id, isBanned.isBanned),
    );
  }
  @UseGuards(AuthBaseGuard)
  @ApiBasicAuth()
  @Put('blogs/:id/bind-with-user/:userId')
  bindBlogs() {
    return 'blogs/:id/bind-with-user/:userId';
  }
}
