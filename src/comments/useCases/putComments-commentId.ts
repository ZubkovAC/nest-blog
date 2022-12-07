import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../comments.repository';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

export class usePutCommentsCommentsId {
  constructor(
    public req: Request,
    public commentId: string,
    public content: string,
  ) {}
}

@CommandHandler(usePutCommentsCommentsId)
export class PutCommentsCommentsId
  implements ICommandHandler<usePutCommentsCommentsId>
{
  constructor(private commentsRepository: CommentsRepository) {}
  async execute(command: usePutCommentsCommentsId) {
    const comment = await this.commentsRepository.getCommentsId(
      command.commentId,
      '1',
    );
    if (!comment) {
      throw new NotFoundException('not found commentId');
    }
    if (
      !comment.content?.trim() ||
      comment.content.trim().length < 20 ||
      comment.content.trim().length > 300
    ) {
      throw new HttpException(
        { message: ['content length > 20 && length  < 300'] },
        HttpStatus.BAD_REQUEST,
      );
    }
    const token = command.req.headers.authorization.split(' ')[1];
    const userData: any = await jwt.verify(token, process.env.SECRET_KEY);
    if (comment.userId === userData.userId) {
      await this.commentsRepository.updateCommentsId(
        command.commentId,
        command.content,
      );
      return;
    }
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
