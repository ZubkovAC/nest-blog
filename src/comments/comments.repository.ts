import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { commentsSchemaInterface } from './comments.schemas';

@Injectable()
export class CommentsRepository {
  constructor(
    @Inject('COMMENTS_MODEL')
    private commentsRepository: Model<commentsSchemaInterface>,
  ) {}
  async getCommentsId(commentId: string) {
    const res = await this.commentsRepository
      .findOne(
        {
          id: commentId,
        },
        '-_id -__v -idPostComment',
      )
      .lean();
    return res;
  }
  async createCommentsPost(newComment: commentsSchemaInterface) {
    return this.commentsRepository.insertMany([newComment]);
  }
  async updateCommentsId(commentId: string, content: string) {
    return this.commentsRepository.updateOne(
      { id: commentId },
      { content: content },
    );
  }
  deleteCommentId(commentId: string) {
    return this.commentsRepository.deleteOne({ id: commentId });
  }
  deleteAll() {
    return this.commentsRepository.deleteMany({});
  }
}
