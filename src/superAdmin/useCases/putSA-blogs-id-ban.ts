import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UsersRepository } from '../../users/users.repository';
import { BlogsRepository } from '../../blogs/blogs.repository';

export class usePutSABlogsIdBan {
  constructor(public id: string, public isBanned: boolean) {}
}

@CommandHandler(usePutSABlogsIdBan)
export class PutSABlogsIdBan implements ICommandHandler<usePutSABlogsIdBan> {
  constructor(
    private usersRepository: UsersRepository,
    private blogsService: BlogsRepository,
  ) {}
  async execute(command: usePutSABlogsIdBan) {
    const { id, isBanned } = command;
    const blog = await this.blogsService.findBlogId(id);
    if (!blog) {
      throw new HttpException(
        { message: ['blogId not found'] },
        HttpStatus.NOT_FOUND,
      );
    }
    let date = new Date().toISOString();
    if (!isBanned) {
      date = null;
    }
    await this.blogsService.bannedForId(id, isBanned);
    return;
  }
}
