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
  ApiSecurity,
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
  @ApiResponse({
    status: 200,
    description: 'Returns the newly created blog',
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
            createdAt: '2022-12-12T15:27:28.350Z',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Get('blogs')
  @ApiBearerAuth()
  @UseGuards(AuthBearerGuard)
  @ApiQuery({ name: 'pageNumber', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'searchNameTerm', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: 'params Object' })
  @ApiQuery({ name: 'sortDirection', required: false, type: 'asc || desc' })
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
  @ApiResponse({
    status: 200,
    description: 'Returns the newly created blog',
    schema: {
      example: {
        pagesCount: 0,
        page: 0,
        pageSize: 0,
        totalCount: 0,
        items: [
          {
            id: 'string',
            content: 'string',
            createdAt: '2022-12-12T15:35:17.563Z',
            likesInfo: {
              likesCount: 0,
              dislikesCount: 0,
              myStatus: 'None',
            },
            commentatorInfo: {
              userId: 'string',
              userLogin: 'string',
            },
            postInfo: {
              id: 'string',
              title: 'string',
              blogId: 'string',
              blogName: 'string',
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
  @Get('blogs/comments')
  @ApiSecurity('bearer')
  @ApiQuery({ name: 'pageNumber', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: 'params Object' })
  @ApiQuery({ name: 'sortDirection', required: false, type: 'asc || desc' })
  async getComments(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Req() req: Request,
  ) {
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
    status: 403,
    description: 'Forbidden',
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
    status: 403,
    description: 'Forbidden',
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

  @ApiBody({
    schema: {
      example: {
        title: 'string maxLength: 30',
        shortDescription: 'string maxLength: 100',
        content: 'string maxLength: 1000',
      },
    },
  })
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        id: 'string',
        title: 'string',
        shortDescription: 'string',
        content: 'string',
        blogId: 'string',
        blogName: 'string',
        createdAt: '2022-12-12T15:39:12.106Z',
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [
            {
              addedAt: '2022-12-12T15:39:12.106Z',
              userId: 'string',
              login: 'string',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
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
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
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

  @ApiResponse({
    status: 204,
    description: 'No content',
  })
  @ApiResponse({
    status: 400,
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
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
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
  @ApiResponse({
    status: 204,
    description: 'No content',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
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

  @ApiSecurity('bearer')
  @ApiResponse({
    status: 200,
    description: 'Return all ban Users',
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
            banInfo: {
              isBanned: true,
              banDate: '2022-12-12T16:12:26.872Z',
              banReason: 'string',
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
  @UseGuards(AuthBearerGuard)
  @Get('users/blog/:id')
  @ApiQuery({ name: 'searchLoginTerm', required: false, type: String })
  @ApiQuery({ name: 'pageNumber', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: 'params Object' })
  @ApiQuery({ name: 'sortDirection', required: false, type: 'asc || desc' })
  getUserBan(
    @Param('id') id: string,
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('searchLoginTerm') searchLoginTerm: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
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
  @ApiSecurity('bearer')
  @ApiBody({
    schema: {
      example: {
        isBanned: 'true - for ban user, false - for unban user',
        banReason: 'string minLength: 20',
        blogId: 'string',
      },
    },
  })
  @ApiResponse({
    status: 204,
    description: 'User ID that should be banned / unbanned',
  })
  @ApiResponse({
    status: 400,
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
