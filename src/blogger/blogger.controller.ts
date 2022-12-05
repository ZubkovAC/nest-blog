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
import { AuthBaseGuard } from '../guards/AuthBase.guard';
import { PostsService } from '../posts/posts.service';
import { BodyCreatePostType } from '../posts/posts.controller';

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
  createBlogs(@Body() inputBlogger: InputBlogType) {
    return this.blogsService.createBlog(inputBlogger);
  }

  @UseGuards(AuthBaseGuard)
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
  @UseGuards(AuthBaseGuard)
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
  @HttpCode(204)
  @ApiBearerAuth()
  @UseGuards(CheckBloggerIdParamsGuard)
  async deleteBlogger(@Param('blogId') blogId: string) {
    await this.blogsService.deleteBlogId(blogId);
    return;
  }

  @Post('blogs/:blogId/posts')
  @ApiBearerAuth()
  @UseGuards(AuthBaseGuard)
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
  @UseGuards(AuthBaseGuard)
  async updateBloggerPost(
    @Param('blogId') blogId: string,
    @Body() blogUpdate: InputBlogType,
  ) {
    await this.blogsService.updateBlogId(blogId, blogUpdate);
    return;
  }
  @Delete('blogs/:blogId/posts')
  @ApiBearerAuth()
  @UseGuards(AuthBaseGuard)
  async deleteBloggerPost(
    @Param('blogId') blogId: string,
    @Body() blogUpdate: InputBlogType,
  ) {
    await this.blogsService.updateBlogId(blogId, blogUpdate);
    return;
  }
}
