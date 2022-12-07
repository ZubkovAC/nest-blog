import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../comments.repository';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { NotFoundException } from '@nestjs/common';

export class useGetCommentsCommentsId {
  constructor(public req: Request, public commentId: string) {}
}

@CommandHandler(useGetCommentsCommentsId)
export class GetCommentsCommentsId
  implements ICommandHandler<useGetCommentsCommentsId>
{
  constructor(private commentsRepository: CommentsRepository) {}
  async execute(command: useGetCommentsCommentsId) {
    const token = command.req.headers.authorization?.split(' ')[1];
    let userId;
    try {
      userId = await jwt.verify(token, process.env.SECRET_KEY);
    } catch (e) {}
    const comments = await this.commentsRepository.getCommentsId(
      command.commentId,
      userId?.userId || '333',
    );
    if (!comments) {
      throw new NotFoundException('not found commentId');
    }
    return comments;
  }
}
