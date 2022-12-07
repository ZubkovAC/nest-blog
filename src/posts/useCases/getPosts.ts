import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsService } from '../posts.service';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

export class useGetPosts {
  constructor(
    public req: Request,
    public pageNumber: string,
    public pageSize: string,
    public sortBy: string,
    public sortDirection: string,
  ) {}
}

@CommandHandler(useGetPosts)
export class GetPosts implements ICommandHandler<useGetPosts> {
  constructor(private postsService: PostsService) {}

  async execute(command: useGetPosts) {
    const { req, pageSize, pageNumber, sortBy, sortDirection } = command;
    const token = req.headers.authorization?.split(' ')[1];
    let userId;
    try {
      userId = jwt.verify(token, process.env.SECRET_KEY);
    } catch (e) {}
    return this.postsService.getPosts(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      userId?.userId || '123',
    );
  }
}
