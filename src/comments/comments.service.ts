import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { UsersRepository } from '../users/users.repository';
import mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CommentsService {
  constructor(
    protected commentsRepository: CommentsRepository,
    protected userRepository: UsersRepository,
  ) {}
  async getCommentsId(commentsId: string) {
    return this.commentsRepository.getCommentsId(commentsId);
  }
  async createCommentIdPost(postId: string, content: string, token: string) {
    const userToken: any = await jwt.verify(
      token.split(' ')[1],
      process.env.SECRET_KEY,
    );

    const user = await this.userRepository.getUserId(userToken.userId);
    if (!user) {
      throw new HttpException(
        { message: ['user not found'] },
        HttpStatus.BAD_REQUEST,
      );
    }
    const id = new mongoose.Types.ObjectId().toString();
    const newCommentPost = {
      idPostComment: postId,
      id: id,
      content: content,
      userId: user.accountData.userId,
      userLogin: user.accountData.login,
      createdAt: new Date().toISOString(),
    };
    await this.commentsRepository.createCommentsPost(newCommentPost);
    // await likesCollectionModel.insertMany([{   // need fix - create likes collection
    //   id:id,
    //   newestLikes: []
    // }])
    return {
      id: id,
      content: content,
      userId: user.accountData.userId,
      userLogin: user.accountData.login,
      createdAt: newCommentPost.createdAt,
      // likesInfo: {
      //   likesCount: 0,
      //   dislikesCount: 0,
      //   myStatus: 'None',
      // },
    };
  }
  async updateCommentId(commentsId: string, content: string) {
    return this.commentsRepository.updateCommentsId(commentsId, content);
  }
  async deleteCommentId(commentsId: string) {
    await this.commentsRepository.deleteCommentId(commentsId);
    return;
  }
}
