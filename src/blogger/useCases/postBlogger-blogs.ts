import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { BlogsService } from '../../blogs/blogs.service';
import { InputBlogType } from '../../blogs/blogs.controller';

export class usePostBloggersBlogs {
  constructor(public req: Request, public inputBlogger: InputBlogType) {}
}

@CommandHandler(usePostBloggersBlogs)
export class PostBloggersBlogs
  implements ICommandHandler<usePostBloggersBlogs>
{
  constructor(private blogsService: BlogsService) {}
  async execute(command: usePostBloggersBlogs) {
    const { req, inputBlogger } = command;
    const token = req.headers.authorization.split(' ')[1];
    const blogger: any = await jwt.verify(token, process.env.SECRET_KEY);
    return this.blogsService.createBlog(
      inputBlogger,
      blogger.userId,
      blogger.login,
    );
  }
}
