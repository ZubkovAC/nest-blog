import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../comments.repository';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

export class useDelCommentsCommentsId {
  constructor(public commentId: string, public req: Request) {}
}

@CommandHandler(useDelCommentsCommentsId)
export class DeleteCommentsCommentsId
  implements ICommandHandler<useDelCommentsCommentsId>
{
  constructor(private commentsRepository: CommentsRepository) {}
  async execute(command: useDelCommentsCommentsId) {
    const comment = await this.commentsRepository.getCommentsId(
      command.commentId,
      '1',
    );
    if (!comment) {
      throw new NotFoundException('not found commentId');
    }
    const token = command.req.headers.authorization.split(' ')[1];
    const userData: any = await jwt.verify(token, process.env.SECRET_KEY);
    if (comment.userId === userData.userId) {
      await this.commentsRepository.deleteCommentId(command.commentId);
      return;
    }
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
