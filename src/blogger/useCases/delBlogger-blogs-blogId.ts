import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { BlogsService } from '../../blogs/blogs.service';

export class useDelBloggersBlogsBlogId {
  constructor(public req: Request, public blogId: string) {}
}

@CommandHandler(useDelBloggersBlogsBlogId)
export class DelBloggersBlogsBlogId
  implements ICommandHandler<useDelBloggersBlogsBlogId>
{
  constructor(private blogsService: BlogsService) {}
  async execute(command: useDelBloggersBlogsBlogId) {
    const { req, blogId } = command;
    const blog = await this.blogsService.getBlogIdSA(blogId);
    const token = req.headers.authorization.split(' ')[1];
    const blogger: any = await jwt.verify(token, process.env.SECRET_KEY);

    if (blogger.userId !== blog.blogOwnerInfo.userId) {
      throw new HttpException({ message: ['forbiden'] }, HttpStatus.FORBIDDEN);
    }
    await this.blogsService.deleteBlogId(blogId);
    return;
  }
}
