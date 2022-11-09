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
  async getPosts(pageNumber: number, pageSize: number, sort: string) {
    const skipCount = (pageNumber - 1) * pageSize;
    const totalCount = await this.postsRepository.countDocuments();

    let posts;

    if (sort === 'asc') {
      posts = await this.postsRepository
        .find({}, '-_id -__v')
        .sort({ name: -1 })
        .skip(skipCount)
        .limit(pageSize)
        .lean();
    }
    if (sort === 'createdAt') {
      posts = await this.postsRepository
        .find({}, '-_id -__v')
        .sort({ youtubeUrl: 1 })
        .skip(skipCount)
        .limit(pageSize)
        .lean();
    }
    if (sort === 'createdOld') {
      posts = await this.postsRepository
        .find({}, '-_id -__v')
        .sort({ youtubeUrl: -1 })
        .skip(skipCount)
        .limit(pageSize)
        .lean();
    }
    if (
      !sort ||
      sort === 'desc' ||
      (sort !== 'asc' && sort !== 'createdAt' && sort !== 'createdOld') ||
      sort
    ) {
      posts = await this.postsRepository
        .find({}, '-_id -__v')
        // .sort({ [sort]: 1 })
        .sort({ name: 1 })
        .skip(skipCount)
        .limit(pageSize)
        .lean();
    }
    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: posts,
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
    blogId: string,
    pageNumber: number,
    pageSize: number,
    sort: string,
  ) {
    const skipCount = (pageNumber - 1) * pageSize;

    let allPostsBlog;
    if (sort === 'asc') {
      allPostsBlog = await this.postsRepository
        .find({}, '-_id -__v')
        .sort({ name: -1 })
        .skip(skipCount)
        .limit(pageSize)
        .lean();
    }
    if (sort === 'createdAt') {
      allPostsBlog = await this.postsRepository
        .find({}, '-_id -__v')
        .sort({ youtubeUrl: 1 })
        .skip(skipCount)
        .limit(pageSize)
        .lean();
    }
    if (sort === 'createdOld') {
      allPostsBlog = await this.postsRepository
        .find({}, '-_id -__v')
        .sort({ youtubeUrl: -1 })
        .skip(skipCount)
        .limit(pageSize)
        .lean();
    }
    if (
      !sort ||
      sort === 'desc' ||
      (sort !== 'asc' && sort !== 'createdAt' && sort !== 'createdOld') ||
      sort
    ) {
      allPostsBlog = await this.postsRepository
        .find({}, '-_id -__v')
        // .sort({ [sort]: 1 })
        .sort({ name: 1 })
        .skip(skipCount)
        .limit(pageSize)
        .lean();
    }

    const allPostsBlogger = await this.postsRepository
      .find({ blogId: blogId })
      .lean();
    // const post = await this.postsRepository
    //   .find({ bloggerId: bloggerId }, '-_id -__v')
    //   .skip(skipCount)
    //   .limit(pageSize)
    //   .lean();
    return {
      pagesCount: Math.ceil(allPostsBlogger.length / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: allPostsBlogger.length,
      items: allPostsBlog,
    };
  }
  async createPost(bodyPosts: BodyCreatePostType) {
    const blogger = await this.bloggersRepository.findOne({
      id: bodyPosts.blogId,
    });
    const id = new mongoose.Types.ObjectId().toString();
    const createdAt = new Date().toISOString();
    await this.postsRepository.insertMany([
      {
        id: id,
        title: bodyPosts.title,
        shortDescription: bodyPosts.shortDescription,
        content: bodyPosts.content,
        blogId: bodyPosts.blogId,
        blogName: blogger.name,
        createdAt: createdAt,
      },
    ]);
    return {
      id: id,
      title: bodyPosts.title,
      shortDescription: bodyPosts.shortDescription,
      content: bodyPosts.content,
      blogId: bodyPosts.blogId,
      blogName: blogger.name,
      createdAt: createdAt,
      // extendedLikesInfo: {
      //   likesCount: 0,
      //   dislikesCount: 0,
      //   myStatus: 'None',
      //   newestLikes: [],
      // },
    };
  }
  async updatePostId(postId: string, updatePost: BodyCreatePostType) {
    // const post = await this.postsRepository.findOne({ id: postId });
    const blogger = await this.bloggersRepository.findOne({
      id: updatePost.blogId,
    });
    await this.postsRepository.updateOne(
      { id: postId },
      {
        id: postId,
        title: updatePost.title,
        shortDescription: updatePost.shortDescription,
        content: updatePost.content,
        blogId: updatePost.blogId,
        blogName: blogger.name,
      },
    );
    return;
  }

  async deletePost(deletePostId: string) {
    return this.postsRepository.deleteOne({ id: deletePostId });
  }
  async deleteAll() {
    await this.postsRepository.deleteMany({});
    return;
  }
}
