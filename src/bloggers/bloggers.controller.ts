import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './bloggers.service';
import { IsUrl, Length } from 'class-validator';
import { CheckBloggerIdGuard } from '../guards/CheckBloggerId.guard';
import { AuthBaseGuard } from '../guards/AuthBase.guard';
import {
  ApiBasicAuth,
  ApiBody,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

export class InputBlogType {
  @ApiProperty()
  @Length(0, 15)
  name: string;
  @ApiProperty()
  @IsUrl()
  @Length(0, 100)
  youtubeUrl: string;
}
class DTO_b {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  youtubeUrl: string;
  @ApiProperty()
  createdAt: Date;
}

class DTO_Blogger {
  @ApiProperty({ type: Number })
  pagesCount: number;

  @ApiProperty({ type: Number })
  page: number;

  @ApiProperty({ type: Number })
  pageSize: number;

  @ApiProperty({ type: Number })
  totalCount: number;

  @ApiProperty({ type: [DTO_b] })
  items: DTO_b[];
}

@ApiTags('blogs')
@Controller('blogs')
export class BlogsController {
  constructor(protected blogsService: BlogsService) {}

  @Get('/')
  @ApiResponse({
    status: 200,
    description: 'return all Bloggers',
    type: DTO_Blogger,
  })
  async getBloggers(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('searchNameTerm') searchNameTerm: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
  ) {
    const by = sortBy !== undefined && sortBy.trim();
    const direction = sortDirection !== undefined && sortDirection.trim();
    return this.blogsService.getBlogs(
      pageNumber,
      pageSize,
      searchNameTerm,
      by || direction || '',
    );
  }
  @Get(':blogId')
  @UseGuards(CheckBloggerIdGuard)
  @ApiResponse({
    status: 200,
    description: 'return all BlogId',
    type: DTO_b,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  async getBlogId(@Param('blogId') blogId: string) {
    return this.blogsService.getBlogId(blogId);
  }

  @Get(':blogId/posts')
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
            title: 'string',
            shortDescription: 'string',
            content: 'string',
            blogId: 'string',
            blogName: 'string',
            createdAt: '2022-11-09T07:07:44.351Z',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  async getBloggerIdPosts(
    @Param('blogId') bloggerId: string,
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
  ) {
    const by = sortBy !== undefined && sortBy.trim();
    const direction = sortDirection !== undefined && sortDirection.trim();

    return this.blogsService.getBlogIdPosts(
      bloggerId,
      pageNumber,
      pageSize,
      by || direction || '',
    );
  }

  @UseGuards(AuthBaseGuard)
  @Post()
  @ApiBasicAuth()
  @ApiBody({
    schema: {
      example: {
        name: 'string Length(0, 15)',
        youtubeUrl:
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
        youtubeUrl: 'string',
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
  async createBlogger(@Body() inputBlogger: InputBlogType) {
    return this.blogsService.createBlog(inputBlogger);
  }
  @ApiBasicAuth()
  @Post(':blogId/posts')
  @ApiBody({
    description: 'Data for constructing new post entity',
    schema: {
      example: {
        title: 'string @Length(0, 30)',
        shortDescription: 'string @Length(0, 100)',
        content: 'string @Length(0, 1000)',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Returns the newly created post',
    schema: {
      example: {
        id: 'string',
        title: 'string',
        shortDescription: 'string',
        content: 'string',
        blogId: 'string',
        blogName: 'string',
        createdAt: '2022-11-09T07:03:39.923Z',
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
  @ApiResponse({
    status: 404,
    description: "If specified blog doesn't exists",
  })
  async createBloggerIdPosts(
    @Param('blogId') blogId: string,
    @Body() valueBlogIdPost: ValueBlogIdPostType,
  ) {
    return this.blogsService.createBlogIdPosts(blogId, valueBlogIdPost);
  }
  @ApiBasicAuth()
  @UseGuards(AuthBaseGuard)
  @UseGuards(CheckBloggerIdGuard)
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
        youtubeUrl:
          'string Length(0, 100) pattern ^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$\n',
      },
    },
  })
  @Put(':blogId')
  async updateBlogger(
    @Param('blogId') blogId: string,
    @Body() blogUpdate: InputBlogType,
  ) {
    await this.blogsService.updateBlogId(blogId, blogUpdate);
    return;
  }
  @ApiBasicAuth()
  @UseGuards(AuthBaseGuard)
  @UseGuards(CheckBloggerIdGuard)
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
  @Delete(':blogId')
  async deleteBlogger(@Param('blogId') blogId: string) {
    await this.blogsService.deleteBlogId(blogId);
    return;
  }
}
export type ValueBlogIdPostType = {
  title: string;
  shortDescription: string;
  content: string;
};
