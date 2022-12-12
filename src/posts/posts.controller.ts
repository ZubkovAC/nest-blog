import {
  Body,
  Controller,
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
import { CommentsService } from '../comments/comments.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthBearerGuard } from '../guards/AuthBearer.guard';
import { Request } from 'express';
import { BlogsService } from '../blogs/blogs.service';
import { CommandBus } from '@nestjs/cqrs';
import { useGetPostsPostId } from './useCases/getPosts-PostId';
import { useGetPosts } from './useCases/getPosts';
import { useGetPostsPostIdComments } from './useCases/getPosts-postId-comments';
import { usePostPostsPostIdComments } from './useCases/postPosts-postId-comments';
import { usePutPostsPostIdLikeStatus } from './useCases/putPosts-postId-likeStatus';

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
  createdAt: string;
  @ApiProperty()
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: [
      {
        addedAt: string;
        userId: string;
        login: string;
      },
    ];
  };
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
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None || Like ||  Dislike',
          newestLikes: [
            {
              addedAt: '2022-11-05T05:27:41.215Z',
              userId: 'string',
              login: 'string',
              createdAt: '2022-11-08T08:47:05.355Z',
            },
          ],
        },
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
    extendedLikesInfo: {
      likesCount: number;
      dislikesCount: number;
      myStatus: string;
      newestLikes: [
        {
          addedAt: Date;
          userId: string;
          login: string;
        },
      ];
    };
  };
}

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(protected commandBus: CommandBus) {}

  @Get()
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'pageNumber', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: 'params Object' })
  @ApiQuery({ name: 'sortDirection', required: false, type: 'asc || desc' })
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
            extendedLikesInfo: {
              likesCount: 0,
              dislikesCount: 0,
              myStatus: 'None || Like || Dislike',
              newestLikes: [
                {
                  addedAt: 'string',
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
  async getPosts(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Req() req: Request,
  ) {
    return this.commandBus.execute(
      new useGetPosts(req, pageNumber, pageSize, sortBy, sortDirection),
    );
  }

  @Get(':id')
  // @UseGuards(CheckPostIdGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      example: {
        id: 'string',
        title: 'string',
        shortDescription: 'string',
        content: 'string',
        blogId: 'string',
        blogName: 'string',
        createdAt: '2022-11-28T16:41:06.489Z',
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [
            {
              addedAt: '2022-11-28T16:41:06.489Z',
              userId: 'string',
              login: 'string',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  async getPostId(@Param('id') postId: string, @Req() req: Request) {
    return this.commandBus.execute(new useGetPostsPostId(req, postId));
  }

  @Get(':postId/comments') // need fix
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'pageNumber', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: 'params Object' })
  @ApiQuery({ name: 'sortDirection', required: false, type: 'asc || desc' })
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
            likesInfo: {
              likesCount: 0,
              dislikesCount: 0,
              myStatus: 'None || Like || Dislike',
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
  async getCommentsPostId(
    @Param('postId') postId: string,
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Req() req: Request,
  ) {
    return this.commandBus.execute(
      new useGetPostsPostIdComments(
        req,
        postId,
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
      ),
    );
  }

  @ApiBearerAuth()
  @Post(':postId/comments')
  @ApiBody({
    schema: {
      example: {
        content: 'string length 20-300',
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
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
        },
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
    return this.commandBus.execute(
      new usePostPostsPostIdComments(req, postId, content),
    );
  }

  @ApiBearerAuth()
  @Put(':postId/like-status')
  @HttpCode(204)
  @UseGuards(AuthBearerGuard)
  @ApiBody({
    schema: {
      example: {
        likeStatus: 'Like || None || Dislike',
      },
    },
  })
  @ApiResponse({
    status: 204,
    description: 'ok',
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
    description: 'not found postId',
  })
  async likeStatusPost(
    @Body('likeStatus') likeStatus: string,
    @Param('postId') postId: string,
    @Req() req: Request,
  ) {
    return this.commandBus.execute(
      new usePutPostsPostIdLikeStatus(req, postId, likeStatus),
    );
  }
}
