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
import { BloggersService } from './bloggers.service';
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

export class Cat {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  breed: string;
}

export class InputBloggerType {
  @ApiProperty()
  @Length(0, 15)
  name: string;
  @ApiProperty()
  @Length(0, 100)
  @IsUrl()
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
export class BloggersController {
  constructor(protected bloggerService: BloggersService) {}

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
    return this.bloggerService.getBlogs(
      pageNumber,
      pageSize,
      searchNameTerm,
      by || direction || '',
    );
  }

  @UseGuards(CheckBloggerIdGuard)
  @ApiResponse({
    status: 200,
    description: 'return all Bloggers',
    type: DTO_b,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @Get(':id')
  async getBlog(@Param('id') blogId: string) {
    return this.bloggerService.getBlogId(blogId);
  }

  @Get(':blogId/posts')
  async getBloggerIdPosts(
    @Param('blogId') bloggerId: string,
    @Query() pageNumber: string,
    @Query() pageSize: string,
  ) {
    return this.bloggerService.getBloggerIdPosts(
      bloggerId,
      pageNumber,
      pageSize,
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
  async createBlogger(@Body() inputBlogger: InputBloggerType) {
    await this.bloggerService.createBlogger(inputBlogger);
    return;
  }
  @ApiBasicAuth()
  @Post(':blogId/posts')
  async createBloggerIdPosts(
    @Param('blogId') bloggerId: string,
    @Body() valueBloggerIdPost: ValueBloggerIdPostType,
  ) {
    return this.bloggerService.createBloggerIdPosts(
      bloggerId,
      valueBloggerIdPost,
    );
  }
  @ApiBasicAuth()
  @UseGuards(AuthBaseGuard)
  @UseGuards(CheckBloggerIdGuard)
  @Put(':id')
  async updateBlogger(
    @Param('id') bloggerId: string,
    @Body() bloggerUpdate: InputBloggerType,
  ) {
    await this.bloggerService.updateBloggerId(bloggerId, bloggerUpdate);
    return;
  }
  @ApiBasicAuth()
  @UseGuards(AuthBaseGuard)
  @UseGuards(CheckBloggerIdGuard)
  @Delete(':id')
  async deleteBlogger(@Param('id') bloggerId: string) {
    await this.bloggerService.deleteBloggerId(bloggerId);
    return;
  }
}
export type ValueBloggerIdPostType = {
  title: string;
  shortDescription: string;
  content: string;
};
