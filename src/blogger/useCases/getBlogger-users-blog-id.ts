import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { BlogsService } from '../../blogs/blogs.service';

export class useGetBloggerUserBlogIdBan {
  constructor(
    public id: string,
    public req: Request,
    public pageNumber: string,
    public pageSize: string,
    public sortBy: string,
    public sortDirection: string,
    public searchLoginTerm: string,
  ) {}
}
// for banned user - blogs
@CommandHandler(useGetBloggerUserBlogIdBan)
export class GetBloggerUserBlogIdBan
  implements ICommandHandler<useGetBloggerUserBlogIdBan>
{
  constructor(private blogsService: BlogsService) {}
  async execute(command: useGetBloggerUserBlogIdBan) {
    const { req, pageNumber, pageSize, sortBy, sortDirection } = command;
    const token = req.headers?.authorization.split(' ')[1];
    const blogger: any = await jwt.verify(token, process.env.SECRET_KEY);
    return this.blogsService.getBlogsUsersBan(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      blogger.login,
      blogger.userId,
    );
  }
}
