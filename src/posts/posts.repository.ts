import { Inject, Injectable } from '@nestjs/common';
import { BodyCreatePostType } from './posts.controller';
import mongoose, { Model } from 'mongoose';
import { PostsSchemaInterface } from './posts.schemas';
import { bloggersSchema } from '../bloggers/blogger.schemas';
import { likesSchemaInterface } from '../likes/likes.schemas';
import { commentsSchemaInterface } from '../comments/comments.schemas';

@Injectable()
export class PostsRepository {
  constructor(
    @Inject('POSTS_MODEL')
    private postsRepository: Model<PostsSchemaInterface>,
    @Inject('BLOGGERS_MODEL')
    private bloggersRepository: Model<bloggersSchema>,
    @Inject('LIKES_MODEL')
    private likesRepository: Model<likesSchemaInterface>,
    @Inject('COMMENTS_MODEL')
    private commentsRepository: Model<commentsSchemaInterface>,
  ) {}
  async getPosts(pageNumber: number, pageSize: number) {
    const skipCount = (pageNumber - 1) * pageSize;
    const totalCount = await this.postsRepository.countDocuments();
    const bloggersRestrict = await this.postsRepository
      .find({}, '-_id -__v')
      .skip(skipCount)
      .limit(pageSize)
      .lean();
    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: bloggersRestrict,
    };
  }
  async getPostId(postId: string) {
    // await this.likesRepository.find({ id: postId });
    return this.postsRepository.findOne({ id: postId }, '-_id -__v');
  }
  async getPostIdComments(
    postId: string,
    pageNumber: number,
    pageSize: number,
  ) {
    const allCommentsPost = await this.commentsRepository
      .find({ idPostComment: postId })
      .lean();
    const skipCount = (pageNumber - 1) * pageSize;
    const post = await this.commentsRepository
      .find({ idPostComment: postId }, '-_id -__v -idPostComment')
      .skip(skipCount)
      .limit(pageSize)
      .lean();
    console.log(post, allCommentsPost);
    return {
      pagesCount: Math.ceil(allCommentsPost.length / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: allCommentsPost.length,
      items: post,
    };
  }
  async getBloggerIdPosts(
    bloggerId: string,
    pageNumber: number,
    pageSize: number,
  ) {
    const skipCount = (pageNumber - 1) * pageSize;
    const allPostsBlogger = await this.postsRepository
      .find({ bloggerId: bloggerId })
      .lean();
    const post = await this.postsRepository
      .find({ bloggerId: bloggerId }, '-_id -__v')
      .skip(skipCount)
      .limit(pageSize)
      .lean();
    return {
      pagesCount: Math.ceil(allPostsBlogger.length / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: allPostsBlogger.length,
      items: post,
    };
  }
  async createPost(bodyPosts: BodyCreatePostType) {
    const blogger = await this.bloggersRepository.findOne({
      id: bodyPosts.bloggerId,
    });
    await this.postsRepository.insertMany([
      {
        id: new mongoose.Types.ObjectId().toString(),
        title: bodyPosts.title,
        shortDescription: bodyPosts.shortDescription,
        content: bodyPosts.content,
        bloggerId: bodyPosts.bloggerId,
        bloggerName: blogger.name,
        addedAt: new Date().toISOString(),
      },
    ]);
    return {
      id: new mongoose.Types.ObjectId().toString(),
      title: bodyPosts.title,
      shortDescription: bodyPosts.shortDescription,
      content: bodyPosts.content,
      bloggerId: bodyPosts.bloggerId,
      bloggerName: blogger.name,
      addedAt: new Date().toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }
  async updatePostId(postId: string, updatePost: BodyCreatePostType) {
    // const post = await this.postsRepository.findOne({ id: postId });
    const blogger = await this.bloggersRepository.findOne({
      id: updatePost.bloggerId,
    });
    await this.postsRepository.updateOne(
      { id: postId },
      {
        id: postId,
        title: updatePost.title,
        shortDescription: updatePost.shortDescription,
        content: updatePost.content,
        bloggerId: updatePost.bloggerId,
        bloggerName: blogger.name,
      },
    );
    return;
  }

  async deletePost(deletePostId: string) {
    return this.postsRepository.deleteOne({ id: deletePostId });
  }
}
