import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { IsNotEmpty, IsUrl, Length } from 'class-validator';
import { CheckBloggerIdParamsGuard } from '../guards/check-blogger-id-params-guard.service';
import { ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { useGetBlogs } from './useCase/getBlogs';
import { useGetBlogsBlogId } from './useCase/getBlogs-blogId';
import { useGetBlogsBlogIdPosts } from './useCase/getBlogs-blogId-posts';

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
  @ApiProperty()
  description: string;
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty()
  // @Matches(/^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
  websiteUrl: string;
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
  constructor(
    protected blogsService: BlogsService,
    private commandBus: CommandBus,
  ) {}
  @Get()
  @ApiResponse({
    status: 200,
    description: 'return all Bloggers',
    type: DTO_Blogger,
  })
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
  ) {
    return this.commandBus.execute(
      new useGetBlogs(
        pageNumber,
        pageSize,
        searchNameTerm,
        sortBy,
        sortDirection,
      ),
    );
  }
  @Get(':blogId')
  @UseGuards(CheckBloggerIdParamsGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: DTO_b,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  async getBlogId(@Param('blogId') blogId: string) {
    return this.commandBus.execute(new useGetBlogsBlogId(blogId));
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
            extendedLikesInfo: {
              likesCount: 0,
              dislikesCount: 0,
              myStatus: 'None || Like || Dislike',
              newestLikes: [
                {
                  addedAt: '2022-11-28T16:34:10.328Z',
                  userId: 'string',
                  login: 'string',
                },
              ],
            },
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  async getBlogIdPosts(
    @Param('blogId') blogId: string,
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Req() req: Request,
  ) {
    return this.commandBus.execute(
      new useGetBlogsBlogIdPosts(
        req,
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        blogId,
      ),
    );
  }
}
