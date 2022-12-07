import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  pageNumberValidate,
  pageSizeValidate,
  sortDirectionValidation,
  sortPostsValidation,
} from '../../query/query';
import { PostsRepository } from '../../posts/posts.repository';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

export class useGetBlogsBlogIdPosts {
  constructor(
    public req: Request,
    public pageNumber: string,
    public pageSize: string,
    public sort: string,
    public sortDirection: string,
    public bloggerId: string,
  ) {}
}

@CommandHandler(useGetBlogsBlogIdPosts)
export class GetBlogsBlogIdPosts
  implements ICommandHandler<useGetBlogsBlogIdPosts>
{
  constructor(private postsRepository: PostsRepository) {}
  async execute(command: useGetBlogsBlogIdPosts) {
    const token = command.req.headers.authorization?.split(' ')[1];
    let user;
    try {
      user = await jwt.verify(token, process.env.SECRET_KEY);
    } catch (e) {}

    const pageN = pageNumberValidate(command.pageNumber);
    const pageS = pageSizeValidate(command.pageSize);
    const sortV = sortPostsValidation(command.sort);
    const sortD = sortDirectionValidation(command.sortDirection);
    return this.postsRepository.getBloggerIdPosts(
      command.bloggerId,
      pageN,
      pageS,
      sortV,
      sortD,
      user?.userId || '123',
    );
  }
}
