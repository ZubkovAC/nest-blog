import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { likesSchemaInterface } from './likes.schemas';

export class LikesRepository {
  constructor(
    @Inject('LIKES_MODEL')
    private likesRepository: Model<likesSchemaInterface>,
  ) {}
  async createLikes(idPostOrComments: string) {
    const likes = {
      id: idPostOrComments,
      newestLikes: [],
    };
    await this.likesRepository.insertMany([likes]);
    return;
  }
  async updateStatusLikes(
    idPostOrComments: string,
    userId: string,
    login: string,
    likeStatus: string,
  ) {
    const like = this.likesRepository.findOne({
      id: idPostOrComments,
      newestLikes: { $elemMatch: { userId: userId } },
    });
    if (!like) {
      this.likesRepository.updateOne(
        { id: idPostOrComments },
        {
          $push: {
            newestLikes: {
              addedAt: new Date().toISOString(),
              userId: userId,
              login: login,
              myStatus: likeStatus,
            },
          },
        },
      );
    }
    await this.likesRepository.updateOne(
      { id: idPostOrComments },
      {
        $set: {
          'newestLikes.$': {
            addedAt: new Date().toISOString(),
            userId: userId,
            login: login,
            myStatus: likeStatus,
          },
        },
      },
    );
    return;
  }
  async likeCommentsPost(id: string) {
    this.likesRepository.findOne({ id: id });
  }
}
