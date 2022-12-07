import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UsersRepository } from '../../users/users.repository';
import { BanValue } from '../superAdmin.controller';
import { BlogsService } from '../../blogs/blogs.service';
import { PostsService } from '../../posts/posts.service';
import { CommentsService } from 'src/comments/comments.service';

export class usePutSAUserIdBan {
  constructor(public id: string, public banValue: BanValue) {}
}

@CommandHandler(usePutSAUserIdBan)
export class PutSAUserIdBan implements ICommandHandler<usePutSAUserIdBan> {
  constructor(
    private usersRepository: UsersRepository,
    private blogsService: BlogsService,
    private postsService: PostsService,
    private commentsService: CommentsService,
  ) {}
  async execute(command: usePutSAUserIdBan) {
    const { id, banValue } = command;
    const user = await this.usersRepository.getUserId(id);
    if (!user) {
      throw new HttpException({ message: ['postId'] }, HttpStatus.NOT_FOUND);
    }
    let date = new Date().toISOString();
    let banReason = banValue.banReason;
    if (!banValue.isBanned) {
      date = null;
      banReason = null;
    }
    await this.usersRepository.banUser(id, banValue.isBanned, banReason, date);
    await this.blogsService.banned(user.accountData.userId, banValue.isBanned);
    await this.postsService.banned(user.accountData.userId, banValue.isBanned);
    await this.commentsService.banned(
      user.accountData.userId,
      banValue.isBanned,
    );
    return;
  }
}
