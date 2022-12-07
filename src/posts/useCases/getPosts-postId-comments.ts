import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsService } from '../posts.service';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';

export class useGetPostsPostIdComments {
  constructor(
    public req: Request,
    public postId: string,
    public pageNumber: string,
    public pageSize: string,
    public sortBy: string,
    public sortDirection: string,
  ) {}
}

@CommandHandler(useGetPostsPostIdComments)
export class GetPostsPostIdComments
  implements ICommandHandler<useGetPostsPostIdComments>
{
  constructor(private postsService: PostsService) {}

  async execute(command: useGetPostsPostIdComments) {
    const { req, postId, pageSize, pageNumber, sortBy, sortDirection } =
      command;
    const token = req.headers.authorization?.split(' ')[1];
    let userId;
    try {
      userId = await jwt.verify(token, process.env.SECRET_KEY);
    } catch (e) {}
    const post = await this.postsService.getPostId(postId, '123');
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
      userId?.userId || '333',
    );
  }
}
