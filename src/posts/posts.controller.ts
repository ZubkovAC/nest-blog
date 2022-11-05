import {
  Body,
  Controller,
  Delete,
  Get,
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
  CheckBloggerIdGuard,
  CheckBloggerIdPostIdGuard,
} from '../guards/CheckBloggerId.guard';
import { CommentsService } from '../comments/comments.service';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';

export class BodyCreatePostType {
  @Length(0, 30)
  title: string;
  @Length(0, 100)
  shortDescription: string;
  @Length(0, 1000)
  content: string;
  bloggerId: string;
}

class Post_Items {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: string;
  bloggerName: string;
  addedAt: Date;
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
        bloggerId: 'string',
        bloggerName: 'string',
        addedAt: '2022-11-05T05:27:41.215Z',
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None Like Dislike',
          newestLikes: [
            {
              addedAt: '2022-11-05T05:27:41.215Z',
              userId: 'string',
              login: 'string',
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
    bloggerId: string;
    bloggerName: string;
    addedAt: Date;
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
  constructor(
    protected postsService: PostsService,
    protected commentsService: CommentsService,
  ) {}
  @Get()
  @ApiResponse({
    status: 200,
    description: 'return all Posts',
    type: DTO_Posts,
  })
  getPosts(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.postsService.getPosts(pageNumber, pageSize);
  }
  @UseGuards(CheckPostIdGuard)
  @Get(':id')
  getPostId(@Param('id') postId: string) {
    return this.postsService.getPostId(postId);
  }
  @UseGuards(AuthBaseGuard)
  @Post()
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
  @UseGuards(AuthBaseGuard)
  @UseGuards(CheckPostIdGuard)
  @UseGuards(CheckBloggerIdPostIdGuard)
  @Put(':id')
  async updatePost(
    @Param('id') postId: string,
    @Body() updatePost: BodyCreatePostType,
  ) {
    await this.postsService.updatePost(postId, updatePost);
    return;
  }
  @UseGuards(AuthBaseGuard)
  @Delete(':id')
  deletePostId(@Param('id') deletePostId: string) {
    return this.postsService.deletePostId(deletePostId);
  }
}
