import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsService } from '../posts.service';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';

export class useGetPostsPostId {
  constructor(public req: Request, public postId: string) {}
}

@CommandHandler(useGetPostsPostId)
export class GetPostsPostId implements ICommandHandler<useGetPostsPostId> {
  constructor(private postsService: PostsService) {}

  async execute(command: useGetPostsPostId) {
    const { req, postId } = command;
    const token = req.headers.authorization?.split(' ')[1];
    let userId;
    try {
      userId = jwt.verify(token, process.env.SECRET_KEY);
    } catch (e) {}
    const post = await this.postsService.getPostId(
      postId,
      userId?.userId || '123',
    );
    if (!post) {
      throw new HttpException(
        { message: ['postId NOT_FOUND '] },
        HttpStatus.NOT_FOUND,
      );
    }
    return post;
  }
}
