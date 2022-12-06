import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
          $and: [
            {
              id: commentId,
            },
            {
              isBanned: false,
            },
          ],
        },
        '-_id -__v -idPostComment',
      )
      .lean();
    if (!res) {
      throw new NotFoundException('not found commentId');
    }
    return {
      id: res.id,
      content: res.content,
      userId: res.userId,
      userLogin: res.userLogin,
      createdAt: res.createdAt,
      likesInfo: {
        likesCount:
          res.newestLikes?.filter(
            (s) =>
              s.myStatus !== 'None' &&
              s.myStatus !== 'Dislike' &&
              s.isBanned !== true,
          )?.length || 0,
        dislikesCount:
          res.newestLikes?.filter(
            (s) =>
              s.myStatus !== 'Like' &&
              s.myStatus !== 'None' &&
              s.isBanned !== true,
          )?.length || 0,
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
  async banned(userId: string, isBanned: boolean) {
    await this.commentsRepository.updateMany(
      { userId: userId },
      { isBanned: isBanned },
    );
    const res = await this.commentsRepository.updateMany(
      {
        'newestLikes.userId': userId,
      },
      {
        $set: {
          'newestLikes.$.isBanned': isBanned,
        },
      },
    );
    return;
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
    });
    const findUserId = like.newestLikes.find((t) => t.userId === userId);
    if (!findUserId) {
      await this.commentsRepository.updateOne(
        { id: commentId },
        {
          $push: {
            newestLikes: {
              addedAt: new Date().toISOString(),
              userId: userId,
              login: login,
              myStatus: status,
              isBanned: false,
            },
          },
        },
      );
    } else {
      await this.commentsRepository.updateOne(
        { $and: [{ id: commentId }, { 'newestLikes.userId': userId }] },
        {
          $set: {
            'newestLikes.$': {
              addedAt: new Date().toISOString(),
              userId: userId,
              login: login,
              myStatus: status,
              isBanned: false,
            },
          },
        },
      );
    }
    return;
  }
}
