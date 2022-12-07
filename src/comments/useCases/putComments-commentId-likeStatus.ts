import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../comments.repository';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus } from '@nestjs/common';

export class usePutCommentsCommentsIdLikeStatus {
  constructor(
    public req: Request,
    public commentId: string,
    public likeStatus: string,
  ) {}
}

@CommandHandler(usePutCommentsCommentsIdLikeStatus)
export class PutCommentsCommentsIdLikeStatus
  implements ICommandHandler<usePutCommentsCommentsIdLikeStatus>
{
  constructor(private commentsRepository: CommentsRepository) {}
  async execute(command: usePutCommentsCommentsIdLikeStatus) {
    const comment = await this.commentsRepository.getCommentsId(
      command.commentId,
      '1',
    );
    if (
      command.likeStatus !== 'None' &&
      command.likeStatus !== 'Like' &&
      command.likeStatus !== 'Dislike'
    ) {
      throw new HttpException(
        { message: ['likeStatus only Like, Dislike, None'] },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!comment) {
      throw new HttpException('Forbidden', HttpStatus.NOT_FOUND);
    }
    const token = command.req.headers.authorization?.split(' ')[1];
    let userToken;
    try {
      userToken = await jwt.verify(token, process.env.SECRET_KEY);
    } catch (e) {}
    await this.commentsRepository.updateStatus(
      userToken.userId,
      userToken.login,
      comment.id,
      command.likeStatus,
    );
    return;
  }
}
