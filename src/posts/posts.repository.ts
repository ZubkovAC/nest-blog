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
  async getPosts(
    pageNumber: number,
    pageSize: number,
    sort: any,
    sortDirection: any,
  ) {
    const skipCount = (pageNumber - 1) * pageSize;
    const totalCount = await this.postsRepository.countDocuments();

    const posts = await this.postsRepository
      .find({}, '-_id -__v')
      .sort({ [sort]: sortDirection })
      .skip(skipCount)
      .limit(pageSize)
      .lean();

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
    sortBy: any,
    sortDirection: any,
    userId: string,
  ) {
    const allCommentsPost = await this.commentsRepository
      .find({ idPostComment: postId })
      .lean();
    const skipCount = (pageNumber - 1) * pageSize;
    const post = await this.commentsRepository
      .find({ idPostComment: postId }, '-_id -__v -idPostComment')
      .sort({ [sortBy]: sortDirection })
      .skip(skipCount)
      .limit(pageSize)
      .lean();

    const userId1 = '112';

    const searchLike = post.map((p) => ({
      id: p.id,
      content: p.content,
      userId: p.userId,
      userLogin: p.userLogin,
      createdAt: p.createdAt,
      likesInfo: {
        likesCount:
          p.newestLikes?.filter((s) => s.myStatus !== 'Like')?.length || 0,
        dislikesCount:
          p.newestLikes?.filter((s) => s.myStatus !== 'Dislike')?.length || 0,
        myStatus:
          p.newestLikes?.find((u) => u.userId === userId)?.myStatus || 'None',
      },
    }));

    return {
      pagesCount: Math.ceil(allCommentsPost.length / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: allCommentsPost.length,
      items: searchLike,
      // items: post,
    };
  }
  async getBloggerIdPosts(
    blogId: string,
    pageNumber: number,
    pageSize: number,
    sort: any,
    sortDirection: any,
  ) {
    const skipCount = (pageNumber - 1) * pageSize;
    const allPostsBlog = await this.postsRepository
      .find({ blogId: blogId }, '-_id -__v')
      .sort({ [sort]: sortDirection })
      .skip(skipCount)
      .limit(pageSize)
      .lean();

    const post = await this.postsRepository.find(
      { blogId: blogId },
      '-_id -__v',
    );
    return {
      pagesCount: Math.ceil(post.length / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: post.length,
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
    const blogger = await this.bloggersRepository
      .findOne({
        id: updatePost.blogId,
      })
      .lean();
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
