import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { BlogsService } from '../../blogs/blogs.service';
import { HttpException, HttpStatus } from '@nestjs/common';

export class usePutBloggerUserIdBan {
  constructor(
    public id: string,
    public req: Request,
    public isBanned: boolean,
    public banReason: string,
    public blogId: string,
  ) {}
}
// update banned user - blog
@CommandHandler(usePutBloggerUserIdBan)
export class PutBloggerUserIdBan
  implements ICommandHandler<usePutBloggerUserIdBan>
{
  constructor(private blogsService: BlogsService) {}
  async execute(command: usePutBloggerUserIdBan) {
    const { req, id, isBanned, banReason, blogId } = command;
    const token = req.headers?.authorization.split(' ')[1];
    const blogger: any = await jwt.verify(token, process.env.SECRET_KEY);

    const blog = await this.blogsService.getBlogIdSA(blogId);
    if (!blog) {
      throw new HttpException(
        { message: ['blogIs not found'] },
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.blogsService.updateBannedUserId(
      id,
      isBanned,
      banReason,
      blogId,
    );
  }
}
