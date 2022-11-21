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
import { BlogsService } from './bloggers.service';
import { IsNotEmpty, IsUrl, Length } from 'class-validator';
import { CheckBloggerIdParamsGuard } from '../guards/check-blogger-id-params-guard.service';
import { AuthBaseGuard } from '../guards/AuthBase.guard';
import {
  ApiBasicAuth,
  ApiBody,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';

export class InputBlogType {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(2, 15)
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(0, 500)
  description: string;
  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(0, 100)
  websiteUrl: string;
}
class DTO_b {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty()
  // @Matches(/^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
  youtubeUrl: string;
  @ApiProperty()
  createdAt: Date;
}
export class ValueBlogIdPostType {
  @ApiProperty()
  @Length(0, 30)
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
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

class DTO_Blogger {
  @ApiProperty({ type: Number, required: false })
  pagesCount: number;

  @ApiProperty({ type: Number, required: false })
  page: number;

  @ApiProperty({ type: Number, required: false })
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
  @Get()
  @ApiResponse({
    status: 200,
    description: 'return all Bloggers',
    type: DTO_Blogger,
  })
  @ApiQuery({ name: 'pageNumber', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'searchNameTerm', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: 'asc || desc' })
  @ApiQuery({ name: 'sortDirection', required: false, type: 'params Object' })
  async getBloggers(
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
  @Get(':blogId')
  @UseGuards(CheckBloggerIdParamsGuard)
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
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'pageNumber', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: 'asc || desc' })
  @ApiQuery({ name: 'sortDirection', required: false, type: 'params Object' })
  @UseGuards(CheckBloggerIdParamsGuard)
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
    return this.blogsService.getBlogIdPosts(
      bloggerId,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    );
  }

  @UseGuards(AuthBaseGuard)
  @Post()
  @ApiBasicAuth()
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
  async createBlogger(@Body() inputBlogger: InputBlogType) {
    return this.blogsService.createBlog(inputBlogger);
  }
  @Post(':blogId/posts')
  @ApiBasicAuth()
  @UseGuards(AuthBaseGuard)
  @UseGuards(CheckBloggerIdParamsGuard)
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
        youtubeUrl:
          'string Length(0, 100) pattern ^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$\n',
      },
    },
  })
  @HttpCode(204)
  @Put(':blogId')
  @UseGuards(AuthBaseGuard)
  async updateBlogger(
    @Param('blogId') blogId: string,
    @Body() blogUpdate: InputBlogType,
  ) {
    await this.blogsService.updateBlogId(blogId, blogUpdate);
    return;
  }
  @ApiBasicAuth()
  @UseGuards(AuthBaseGuard)
  @UseGuards(CheckBloggerIdParamsGuard)
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
  @HttpCode(204)
  async deleteBlogger(@Param('blogId') blogId: string) {
    await this.blogsService.deleteBlogId(blogId);
    return;
  }
}
