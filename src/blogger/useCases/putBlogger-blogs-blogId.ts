import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsService } from '../../blogs/blogs.service';
import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { InputBlogType } from '../../blogs/blogs.controller';

export class usePutBloggersBlogsBlogId {
  constructor(
    public req: Request,
    public blogId: string,
    public blogUpdate: InputBlogType,
  ) {}
}

@CommandHandler(usePutBloggersBlogsBlogId)
export class PutBloggersBlogsBlogId
  implements ICommandHandler<usePutBloggersBlogsBlogId>
{
  constructor(private blogsService: BlogsService) {}
  async execute(command: usePutBloggersBlogsBlogId) {
    const { req, blogId, blogUpdate } = command;

    const blog = await this.blogsService.getBlogIdSA(blogId);
    const token = req.headers.authorization.split(' ')[1];
    const blogger: any = await jwt.verify(token, process.env.SECRET_KEY);

    if (blogger.userId !== blog.blogOwnerInfo.userId) {
      throw new HttpException({ message: ['forbiden'] }, HttpStatus.FORBIDDEN);
    }
    await this.blogsService.updateBlogId(blogId, blogUpdate);
    return;
  }
}
