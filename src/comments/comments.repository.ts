import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { commentsSchemaInterface } from './comments.schemas';

@Injectable()
export class CommentsRepository {
  constructor(
    @Inject('COMMENTS_MODEL')
    private commentsRepository: Model<commentsSchemaInterface>,
  ) {}
  async getCommentsId(commentId: string, userId: string) {
    const res = await this.commentsRepository
      .findOne(
        {
          id: commentId,
        },
        '-_id -__v -idPostComment',
      )
      .lean();
    return {
      id: res.id,
      content: res.content,
      userId: res.userId,
      userLogin: res.userLogin,
      createdAt: res.createdAt,
      likesInfo: {
        likesCount:
          res.newestLikes?.filter((s) => s.myStatus !== 'Like')?.length || 0,
        dislikesCount:
          res.newestLikes?.filter((s) => s.myStatus !== 'Dislike')?.length || 0,
        myStatus:
          res.newestLikes?.find((u) => u.userId === userId)?.myStatus || 'None',
      },
    };
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
  async deleteCommentId(commentId: string) {
    return this.commentsRepository.deleteOne({ id: commentId });
  }
  async deleteAll() {
    return this.commentsRepository.deleteMany({});
  }
  async updateStatus(
    userId: string,
    login: string,
    commentId: string,
    status: string,
  ) {
    const like = await this.commentsRepository.findOne({
      id: commentId,
      newestLikes: { $elemMatch: { userId: userId } },
    });
    if (!like) {
      await this.commentsRepository.updateOne(
        { id: commentId },
        {
          $push: {
            newestLikes: {
              addedAt: new Date().toISOString(),
              userId: userId,
              login: login,
              myStatus: status,
            },
          },
        },
      );
    } else {
      await this.commentsRepository.updateOne(
        { id: commentId },
        {
          $set: {
            'newestLikes.$': {
              addedAt: new Date().toISOString(),
              userId: userId,
              login: login,
              myStatus: status,
            },
          },
        },
      );
    }
    return;
  }
}
