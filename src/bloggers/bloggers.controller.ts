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
import { Length } from 'class-validator';
import { CheckBloggerIdGuard } from '../guards/CheckBloggerId.guard';
import { AuthBaseGuard } from '../guards/AuthBase.guard';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';

export class InputBloggerType {
  @Length(0, 15)
  name: string;
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
}
class DTO_Blogger {
  @ApiProperty()
  pagesCount: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalCount: number;

  @ApiProperty({
    example: [{ id: '123123', name: '123123', youtubeUrl: 'asdfasdf' }],
    // default: [DTO_b],
  })
  items: DTO_b[];
}

@ApiTags('bloggers')
@Controller('bloggers')
export class BloggersController {
  constructor(protected bloggerService: BloggersService) {}
  @Get()
  @ApiResponse({
    status: 200,
    description: 'return all Bloggers',
    type: DTO_Blogger,
  })
  async getBloggers(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('searchNameTerm') searchNameTerm: string,
  ) {
    return this.bloggerService.getBloggers(
      pageNumber,
      pageSize,
      searchNameTerm,
    );
  }
  @Get(':bloggerId/posts')
  async getBloggerIdPosts(
    @Param('bloggerId') bloggerId: string,
    @Query() pageNumber: string,
    @Query() pageSize: string,
  ) {
    return this.bloggerService.getBloggerIdPosts(
      bloggerId,
      pageNumber,
      pageSize,
    );
  }
  @Post(':bloggerId/posts')
  async createBloggerIdPosts(
    @Param('bloggerId') bloggerId: string,
    @Body() valueBloggerIdPost: ValueBloggerIdPostType,
  ) {
    return this.bloggerService.createBloggerIdPosts(
      bloggerId,
      valueBloggerIdPost,
    );
  }
  @UseGuards(CheckBloggerIdGuard)
  @Get(':id')
  async getBlogger(@Param('id') bloggerId: string) {
    return this.bloggerService.getBloggerId(bloggerId);
  }
  @UseGuards(AuthBaseGuard)
  @Post()
  async createBlogger(@Body() inputBlogger: InputBloggerType) {
    await this.bloggerService.createBlogger(inputBlogger);
    return;
  }
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
