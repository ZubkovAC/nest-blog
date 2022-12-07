import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsService } from '../posts.service';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';

export class usePutPostsPostIdLikeStatus {
  constructor(
    public req: Request,
    public postId: string,
    public likeStatus: string,
  ) {}
}

@CommandHandler(usePutPostsPostIdLikeStatus)
export class PutPostsPostIdLikeStatus
  implements ICommandHandler<usePutPostsPostIdLikeStatus>
{
  constructor(private postsService: PostsService) {}

  async execute(command: usePutPostsPostIdLikeStatus) {
    const { req, postId, likeStatus } = command;
    const post = await this.postsService.getPostId(postId, '123');
    if (!post) {
      throw new HttpException(
        { message: 'post not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    const token = req.headers.authorization?.split(' ')[1];
    let user;
    try {
      user = jwt.verify(token, process.env.SECRET_KEY);
    } catch (e) {}
    if (
      likeStatus !== 'None' &&
      likeStatus !== 'Like' &&
      likeStatus !== 'Dislike'
    ) {
      throw new HttpException(
        { message: ['likeStatus only Like, Dislike, None'] },
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.postsService.likeStatusPost(
      postId,
      user.userId,
      user.login,
      likeStatus,
    );
    return;
  }
}
