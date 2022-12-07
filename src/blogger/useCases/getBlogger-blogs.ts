import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { BlogsService } from '../../blogs/blogs.service';

export class useGetBloggersBlogs {
  constructor(
    public req: Request,
    public pageNumber: string,
    public pageSize: string,
    public searchNameTerm: string,
    public sortBy: string,
    public sortDirection: string,
  ) {}
}

@CommandHandler(useGetBloggersBlogs)
export class GetBloggersBlogs implements ICommandHandler<useGetBloggersBlogs> {
  constructor(private blogsService: BlogsService) {}
  async execute(command: useGetBloggersBlogs) {
    const { req, pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
      command;
    const token = req.headers.authorization.split(' ')[1];
    const blogger: any = await jwt.verify(token, process.env.SECRET_KEY);
    return this.blogsService.getBloggerBlogs(
      pageNumber,
      pageSize,
      searchNameTerm,
      sortBy,
      sortDirection,
      blogger.login,
    );
  }
}
