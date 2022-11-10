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
import { PostsService } from './posts.service';
import { Length } from 'class-validator';
import { CheckPostIdGuard } from '../guards/CheckPostId.guard';
import { AuthBaseGuard } from '../guards/AuthBase.guard';
import {
  CheckBloggerIdParamsGuard,
  CheckBloggerIdBodyGuard,
} from '../guards/check-blogger-id-params-guard.service';
import { CommentsService } from '../comments/comments.service';
import {
  ApiBasicAuth,
  ApiBody,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

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
  @Length(0, 30)
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
    protected commentsService: CommentsService,
  ) {}
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: DTO_Posts,
  })
  getPosts(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
  ) {
    return this.postsService.getPosts(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    );
  }

  @UseGuards(CheckPostIdGuard)
  @Get(':id')
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
  getPostId(@Param('id') postId: string) {
    return this.postsService.getPostId(postId);
  }
  @ApiBasicAuth()
  @Post()
  @UseGuards(AuthBaseGuard)
  @UseGuards(CheckBloggerIdBodyGuard)
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
  createPost(@Body() bodyPosts: BodyCreatePostType) {
    return this.postsService.createPost(bodyPosts);
  }
  @Get(':postId/Comments') // need fix
  async getCommentsPostId(
    @Param('postId') postId: string,
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.postsService.getPostIdComments(postId, pageNumber, pageSize);
  }
  @Post(':postId/Comments')
  @ApiBasicAuth()
  async createPostIdComment(
    @Param('postId') postId: string,
    @Body('content') content: string,
    @Req() req: any,
  ) {
    const token: string = req.headers.authorization;
    return await this.commentsService.createCommentIdPost(
      postId,
      content,
      token,
    );
  }
  @Put(':id')
  @UseGuards(AuthBaseGuard)
  @UseGuards(CheckPostIdGuard)
  @UseGuards(CheckBloggerIdBodyGuard)
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
    await this.postsService.updatePost(postId, updatePost);
    return;
  }

  @Delete(':id')
  @UseGuards(AuthBaseGuard)
  @UseGuards(CheckPostIdGuard)
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
