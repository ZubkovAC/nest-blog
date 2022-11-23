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
  Res,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Length } from 'class-validator';
import { CheckPostIdGuard } from '../guards/CheckPostId.guard';
import { AuthBaseGuard } from '../guards/AuthBase.guard';
import { CommentsService } from '../comments/comments.service';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthBearerGuard } from '../guards/AuthBearer.guard';
import { Request } from 'express';
import { BlogsService } from '../bloggers/bloggers.service';

export class BodyCreatePostType {
  @ApiProperty()
  @Length(0, 30)
  title: string;
  @ApiProperty()
  @Length(0, 100)
  shortDescription: string;
  @ApiProperty()
  @Length(0, 1000)
  content: string;
  @ApiProperty()
  blogId: string;
}

class Post_Items {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  shortDescription: string;
  @ApiProperty()
  content: string;
  @ApiProperty()
  blogId: string;
  @ApiProperty()
  blogName: string;
  @ApiProperty()
  createdAt: Date;
  // extendedLikesInfo: {
  //   likesCount: number;
  //   dislikesCount: number;
  //   myStatus: string;
  //   newestLikes: [
  //     {
  //       addedAt: Date;
  //       userId: string;
  //       login: string;
  //     },
  //   ];
  // };
}

class DTO_Posts {
  @ApiProperty()
  pagesCount: number;
  @ApiProperty()
  page: number;
  @ApiProperty()
  pageSize: number;
  @ApiProperty()
  totalCount: number;
  @ApiProperty({
    example: [
      {
        id: 'string',
        title: 'string',
        shortDescription: 'string',
        content: 'string',
        blogId: 'string',
        blogName: 'string',
        createdAt: '2022-11-05T05:27:41.215Z',
        // extendedLikesInfo: {
        //   likesCount: 0,
        //   dislikesCount: 0,
        //   myStatus: 'None Like Dislike',
        //   newestLikes: [
        //     {
        //       addedAt: '2022-11-05T05:27:41.215Z',
        //       userId: 'string',
        //       login: 'string',
        //       createdAt: '2022-11-08T08:47:05.355Z',
        //     },
        //   ],
        // },
      },
    ],
    default: [Post_Items],
  })
  items: {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
    // extendedLikesInfo: {
    //   likesCount: number;
    //   dislikesCount: number;
    //   myStatus: string;
    //   newestLikes: [
    //     {
    //       addedAt: Date;
    //       userId: string;
    //       login: string;
    //     },
    //   ];
    // };
  };
}

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected blogsService: BlogsService,
    protected commentsService: CommentsService, // protected userRepository: UsersRepository,
  ) {}

  @Get()
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'pageNumber', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: 'asc || desc' })
  @ApiQuery({ name: 'sortDirection', required: false, type: 'params Object' })
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
            createdAt: '2022-11-21T10:11:46.633Z',
          },
        ],
      },
    },
  })
  async getPosts(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    // @Res({ passthrough: true }) response: Response,
  ) {
    return this.postsService.getPosts(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    );
  }

  @Get(':id')
  // @UseGuards(CheckPostIdGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: Post_Items,
    schema: {
      example: Post_Items,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  async getPostId(@Param('id') postId: string) {
    const post = await this.postsService.getPostId(postId);
    if (!post) {
      throw new HttpException(
        { message: ['postId NOT_FOUND '] },
        HttpStatus.NOT_FOUND,
      );
    }
    return post;
  }

  @Get(':postId/comments') // need fix
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'pageNumber', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: 'asc || desc' })
  @ApiQuery({ name: 'sortDirection', required: false, type: 'params Object' })
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
            content: 'string',
            userId: 'string',
            userLogin: 'string',
            createdAt: '2022-11-21T10:14:21.053Z',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  async getCommentsPostId(
    @Param('postId') postId: string,
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
  ) {
    const post = await this.postsService.getPostId(postId);
    if (!post) {
      throw new HttpException(
        { message: ['postId NOT_FOUND '] },
        HttpStatus.NOT_FOUND,
      );
    }
    return this.postsService.getPostIdComments(
      postId,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    );
  }

  @Post()
  @UseGuards(AuthBaseGuard)
  @ApiBody({
    schema: {
      example: {
        id: 'string',
        title: 'string @Length(0, 30)',
        shortDescription: 'string @Length(0, 100)',
        content: 'string @Length(0, 1000)',
        blogId: 'string',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Returns the newly created post',
    schema: {
      example: {
        id: 'string',
        title: 'string ',
        shortDescription: 'string ',
        content: 'string ',
        blogId: 'string',
        blogName: 'string',
        createdAt: '2022-11-09T04:08:32.749Z',
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
  async createPost(@Body() bodyPosts: BodyCreatePostType) {
    const blog = await this.blogsService.getBlogId(bodyPosts.blogId);
    if (!blog) {
      throw new HttpException(
        { message: ['blogs not found'] },
        HttpStatus.NOT_FOUND,
      );
    }
    return this.postsService.createPost(bodyPosts);
  }
  @ApiBearerAuth()
  @Post(':postId/comments')
  @ApiBody({
    schema: {
      example: {
        content: 'stringstringstringst',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Returns the newly created post',
    schema: {
      example: {
        id: 'string',
        content: 'string',
        userId: 'string',
        userLogin: 'string',
        createdAt: '2022-11-21T10:15:36.069Z',
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
    description: "If post with specified postId doesn't exists",
  })
  @UseGuards(AuthBearerGuard)
  async createPostIdComment(
    @Param('postId') postId: string,
    @Body('content') content: string,
    @Req() req: Request,
  ) {
    const post = await this.postsService.getPostId(postId);
    if (!post) {
      throw new HttpException(
        { message: ['postId NOT_FOUND '] },
        HttpStatus.NOT_FOUND,
      );
    }
    if (
      !content?.trim() ||
      content.trim().length < 20 ||
      content.trim().length > 300
    ) {
      throw new HttpException(
        { message: ['content length > 20 && length  < 300'] },
        HttpStatus.BAD_REQUEST,
      );
    }
    const token: any = req.headers.authorization;
    return await this.commentsService.createCommentIdPost(
      postId,
      content,
      token,
    );
  }

  @Put(':id')
  @UseGuards(AuthBaseGuard)
  @ApiBody({
    schema: {
      example: {
        title: 'string @Length(0, 30)',
        shortDescription: 'string @Length(0, 100)',
        content: 'string @Length(0, 1000)',
        blogId: 'string',
      },
    },
  })
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
  @ApiBasicAuth()
  @HttpCode(204)
  async updatePost(
    @Param('id') postId: string,
    @Body() updatePost: BodyCreatePostType,
  ) {
    const post = this.postsService.getPostId(postId);
    if (!post) {
      throw new HttpException('not found postId', HttpStatus.NOT_FOUND);
    }
    await this.postsService.updatePost(postId, updatePost);
    return;
  }

  @Delete(':id')
  @UseGuards(CheckPostIdGuard)
  @UseGuards(AuthBaseGuard)
  @ApiBasicAuth()
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
  @HttpCode(204)
  async deletePostId(@Param('id') deletePostId: string) {
    await this.postsService.deletePostId(deletePostId);
    return;
  }
}
