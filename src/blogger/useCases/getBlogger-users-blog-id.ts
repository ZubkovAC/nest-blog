import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { BlogsService } from '../../blogs/blogs.service';
import { UsersService } from '../../users/users.service';
import { UsersRepository } from '../../users/users.repository';
import { HttpException, HttpStatus } from '@nestjs/common';

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
  constructor(
    private blogsService: BlogsService,
    private userRepository: UsersRepository,
  ) {}
  async execute(command: useGetBloggerUserBlogIdBan) {
    const { req, pageNumber, pageSize, sortBy, sortDirection, id } = command;
    const token = req.headers?.authorization.split(' ')[1];
    const blogger: any = await jwt.verify(token, process.env.SECRET_KEY);

    const user = await this.userRepository.getUserId(blogger.userId);
    const blog = await this.blogsService.getBlogIdSA(id);
    if (!user) {
      throw new HttpException(
        { message: ['userId not found'] },
        HttpStatus.NOT_FOUND,
      );
    }
    if (blogger.userId !== blog.blogOwnerInfo.userId) {
      throw new HttpException(
        { message: ['FORBIDDEN not found'] },
        HttpStatus.FORBIDDEN,
      );
    }
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
