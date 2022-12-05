import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthBearerGuard } from '../guards/AuthBearer.guard';
import { BlogsService } from '../blogs/blogs.service';
import { InputBlogType } from '../blogs/blogs.controller';
import { CheckBloggerIdParamsGuard } from '../guards/check-blogger-id-params-guard.service';
import { PostsService } from '../posts/posts.service';
import { BodyCreatePostType } from '../posts/posts.controller';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@ApiTags('For Blogger')
@Controller('blogger')
export class BloggerController {
  constructor(
    protected blogsService: BlogsService,
    protected postsService: PostsService,
  ) {}
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
    const token = req.headers.authorization.split(' ')[1];
    const blogger: any = await jwt.verify(token, process.env.SECRET_KEY);
    return this.blogsService.getBloggerBlogs(
      pageNumber,
      pageSize,
      searchNameTerm,
      sortBy,
      sortDirection,
      blogger.login,
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
    const token = req.headers.authorization.split(' ')[1];
    const blogger: any = await jwt.verify(token, process.env.SECRET_KEY);
    return this.blogsService.createBlog(
      inputBlogger,
      blogger.userId,
      blogger.login,
    );
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
  ) {
    await this.blogsService.updateBlogId(blogId, blogUpdate);
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
    // 403 need
    const blog = await this.blogsService.getBlogId(blogId);
    const token = req.headers.authorization.split(' ')[1];
    const blogger: any = await jwt.verify(token, process.env.SECRET_KEY);
    if (blogger.userId !== blog.blogOwnerInfo.userId) {
      throw new HttpException({ message: ['forbiden'] }, HttpStatus.FORBIDDEN);
    }
    await this.blogsService.deleteBlogId(blogId);
    return;
  }

  @Post('blogs/:blogId/posts')
  @ApiBearerAuth()
  @UseGuards(AuthBearerGuard)
  async createBloggerPost(
    @Param('blogId') blogId: string,
    @Body() createPost: BodyCreatePostType, // need fix no blogId
  ) {
    // posts
    await this.postsService.createPost({
      blogId,
      title: createPost.title,
      shortDescription: createPost.shortDescription,
      content: createPost.content,
    });
    return;
  }
  @Put('blogs/:blogId/posts')
  @ApiBearerAuth()
  @UseGuards(AuthBearerGuard)
  async updateBloggerPost(
    @Param('blogId') blogId: string,
    @Body() blogUpdate: InputBlogType,
  ) {
    await this.blogsService.updateBlogId(blogId, blogUpdate);
    return;
  }
  @Delete('blogs/:blogId/posts')
  @ApiBearerAuth()
  @UseGuards(AuthBearerGuard)
  async deleteBloggerPost(
    @Param('blogId') blogId: string,
    @Body() blogUpdate: InputBlogType,
  ) {
    await this.blogsService.updateBlogId(blogId, blogUpdate);
    return;
  }
}
