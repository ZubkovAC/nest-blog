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
  ApiProperty,
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
import { IsNotEmpty, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { CommandBus } from '@nestjs/cqrs';
import { useGetBloggersBlogs } from './useCases/getBlogger-blogs';
import { usePostBloggersBlogs } from './useCases/postBlogger-blogs';
import { usePostBloggersBlogsBlogIdPosts } from './useCases/postBlogger-blogs-blogId-posts';
import { useDelBloggersBlogsBlogId } from './useCases/delBlogger-blogs-blogId';
import { useDelBloggersBlogsBlogIdPostsPostId } from './useCases/delBlogger-blogs-blogId-posts-postId';
import { usePutBloggersBlogsBlogIdPostsPostId } from './useCases/putBlogger-blogs-blogId-posts-postId';
import { usePutBloggersBlogsBlogId } from './useCases/putBlogger-blogs-blogId';

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

@ApiTags('For Blogger')
@Controller('blogger')
export class BloggerController {
  constructor(
    protected commandBus: CommandBus, // protected blogsService: BlogsService, // protected postsService: PostsService,
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
    // const token = req.headers.authorization.split(' ')[1];
    // const blogger: any = await jwt.verify(token, process.env.SECRET_KEY);
    // return this.blogsService.getBloggerBlogs(
    //   pageNumber,
    //   pageSize,
    //   searchNameTerm,
    //   sortBy,
    //   sortDirection,
    //   blogger.login,
    // );
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
    // const token = req.headers.authorization.split(' ')[1];
    // const blogger: any = await jwt.verify(token, process.env.SECRET_KEY);
    // return this.blogsService.createBlog(
    //   inputBlogger,
    //   blogger.userId,
    //   blogger.login,
    // );
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
    // const blog = await this.blogsService.getBlogIdSA(blogId);
    // const token = req.headers.authorization.split(' ')[1];
    // const blogger: any = await jwt.verify(token, process.env.SECRET_KEY);
    //
    // if (blogger.userId !== blog.blogOwnerInfo.userId) {
    //   throw new HttpException({ message: ['forbiden'] }, HttpStatus.FORBIDDEN);
    // }
    // await this.blogsService.updateBlogId(blogId, blogUpdate);
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
    // const blog = await this.blogsService.getBlogIdSA(blogId);
    // const token = req.headers.authorization.split(' ')[1];
    // const blogger: any = await jwt.verify(token, process.env.SECRET_KEY);
    //
    // if (blogger.userId !== blog.blogOwnerInfo.userId) {
    //   throw new HttpException({ message: ['forbiden'] }, HttpStatus.FORBIDDEN);
    // }
    // await this.blogsService.deleteBlogId(blogId);
    // return;
  }

  @Post('blogs/:blogId/posts')
  @ApiBearerAuth()
  @UseGuards(AuthBearerGuard)
  async createBloggerPost(
    @Param('blogId') blogId: string,
    @Body() createPost: BodyCreatePostType, // need fix no blogId
    @Req() req: Request,
  ) {
    return this.commandBus.execute(
      new usePostBloggersBlogsBlogIdPosts(req, createPost, blogId),
    );
    // const token = req.headers.authorization.split(' ')[1];
    // const user: any = await jwt.verify(token, process.env.SECRET_KEY);
    // return this.postsService.createPost(
    //   {
    //     blogId,
    //     title: createPost.title,
    //     shortDescription: createPost.shortDescription,
    //     content: createPost.content,
    //   },
    //   user.userId,
    // );
  }
  // need fix
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
    // await this.blogsService.updateBlogIdPostId(blogId, postId, blogUpdate);
    // return;
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
    // await this.postsService.deletePostId(postId);
    // return;
  }
}
