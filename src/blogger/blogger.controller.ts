import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthBearerGuard } from '../guards/AuthBearer.guard';
import { InputBlogType } from '../blogs/blogs.controller';
import { CheckBloggerIdParamsGuard } from '../guards/check-blogger-id-params-guard.service';
import { BodyCreatePostType } from '../posts/posts.controller';
import { Request } from 'express';
import { IsBoolean, IsNotEmpty, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { CommandBus } from '@nestjs/cqrs';
import { useGetBloggersBlogs } from './useCases/getBlogger-blogs';
import { usePostBloggersBlogs } from './useCases/postBlogger-blogs';
import { usePostBloggersBlogsBlogIdPosts } from './useCases/postBlogger-blogs-blogId-posts';
import { useDelBloggersBlogsBlogId } from './useCases/delBlogger-blogs-blogId';
import { useDelBloggersBlogsBlogIdPostsPostId } from './useCases/delBlogger-blogs-blogId-posts-postId';
import { usePutBloggersBlogsBlogIdPostsPostId } from './useCases/putBlogger-blogs-blogId-posts-postId';
import { usePutBloggersBlogsBlogId } from './useCases/putBlogger-blogs-blogId';
import { useGetBloggersComments } from './useCases/getBlogger-blogs-comments';
import { useGetBloggerUserBlogIdBan } from './useCases/getBlogger-users-blog-id';
import { usePutBloggerUserIdBan } from './useCases/putBlogger-users-id-ban';

export class blogUpdateValue {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(0, 30)
  title: string;
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(0, 100)
  shortDescription: string;
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(0, 1000)
  content: string;
}
export class banBodyValue {
  @IsNotEmpty()
  @IsBoolean()
  isBanned: boolean;
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(20, 200)
  banReason: string;
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  blogId: string;
}

@ApiTags('For Blogger')
@Controller('blogger')
export class BloggerController {
  constructor(protected commandBus: CommandBus) {}
  @Get('blogs')
  @ApiBearerAuth()
  @UseGuards(AuthBearerGuard)
  @ApiQuery({ name: 'pageNumber', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'searchNameTerm', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: 'asc || desc' })
  @ApiQuery({ name: 'sortDirection', required: false, type: 'params Object' })
  async getBlogs(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('searchNameTerm') searchNameTerm: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Req() req: Request,
  ) {
    return this.commandBus.execute(
      new useGetBloggersBlogs(
        req,
        pageNumber,
        pageSize,
        searchNameTerm,
        sortBy,
        sortDirection,
      ),
    );
  }
  @UseGuards(AuthBearerGuard)
  @Get('blogs/comments')
  async getComments(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('searchNameTerm') searchNameTerm: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Req() req: Request,
  ) {
    // return 'hell';
    return this.commandBus.execute(
      new useGetBloggersComments(
        req,
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
      ),
    );
  }
  @Post('blogs')
  @ApiBearerAuth()
  @UseGuards(AuthBearerGuard)
  @ApiBody({
    schema: {
      example: {
        name: 'string Length(0, 15)',
        description: 'string Length(0, 500)',
        websiteUrl:
          'string Length(0, 100) pattern ^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$\n',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Returns the newly created blog',
    schema: {
      example: {
        id: 'string',
        name: 'string',
        description: 'string',
        websiteUrl: 'string',
        createdAt: '2022-11-08T08:53:15.121Z',
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
  async createBlogs(@Body() inputBlogger: InputBlogType, @Req() req: Request) {
    return this.commandBus.execute(new usePostBloggersBlogs(req, inputBlogger));
  }

  @UseGuards(AuthBearerGuard)
  @UseGuards(CheckBloggerIdParamsGuard)
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
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @ApiBody({
    schema: {
      example: {
        name: 'string maxLength: 15',
        description: 'string maxLength: 500',
        websiteUrl:
          'string Length(0, 100) pattern ^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$\n',
      },
    },
  })
  @HttpCode(204)
  @Put('blogs/:blogId')
  @ApiBearerAuth()
  @UseGuards(AuthBearerGuard)
  async updateBlogger(
    @Param('blogId') blogId: string,
    @Body() blogUpdate: InputBlogType,
    @Req() req: Request,
  ) {
    await this.commandBus.execute(
      new usePutBloggersBlogsBlogId(req, blogId, blogUpdate),
    );
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
    description: 'Not Found',
  })
  @Delete('blogs/:blogId')
  @UseGuards(AuthBearerGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  @UseGuards(CheckBloggerIdParamsGuard)
  async deleteBlogger(@Param('blogId') blogId: string, @Req() req: Request) {
    await this.commandBus.execute(new useDelBloggersBlogsBlogId(req, blogId));
    return;
  }

  @Post('blogs/:blogId/posts')
  @ApiBearerAuth()
  @UseGuards(AuthBearerGuard)
  async createBloggerPost(
    @Param('blogId') blogId: string,
    @Body() createPost: BodyCreatePostType,
    @Req() req: Request,
  ) {
    return this.commandBus.execute(
      new usePostBloggersBlogsBlogIdPosts(req, createPost, blogId),
    );
  }
  @Put('blogs/:blogId/posts/:postId')
  @ApiBearerAuth()
  @HttpCode(204)
  @UseGuards(AuthBearerGuard)
  async updateBloggerPost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() blogUpdate: blogUpdateValue,
    @Req() req: Request,
  ) {
    await this.commandBus.execute(
      new usePutBloggersBlogsBlogIdPostsPostId(blogId, postId, blogUpdate, req),
    );
    return;
  }
  @Delete('blogs/:blogId/posts/:postId')
  @HttpCode(204)
  @ApiBearerAuth()
  @UseGuards(AuthBearerGuard)
  async deleteBloggerPost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Req() req: Request,
  ) {
    await this.commandBus.execute(
      new useDelBloggersBlogsBlogIdPostsPostId(postId, blogId, req),
    );
    return;
  }

  @UseGuards(AuthBearerGuard)
  @Get('users/blog/:id')
  getUserBan(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('searchLoginTerm') searchLoginTerm: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.commandBus.execute(
      new useGetBloggerUserBlogIdBan(
        id,
        req,
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        searchLoginTerm,
      ),
    );
  }

  @HttpCode(204)
  @UseGuards(AuthBearerGuard)
  @Put('users/:id/ban')
  banUser(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() banBody: { isBanned: boolean; banReason: string; blogId: string },
  ) {
    return this.commandBus.execute(
      new usePutBloggerUserIdBan(
        id,
        req,
        banBody.isBanned,
        banBody.banReason,
        banBody.blogId,
      ),
    );
  }
}
