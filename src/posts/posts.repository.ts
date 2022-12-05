import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BodyCreatePostType } from './posts.controller';
import mongoose, { Model } from 'mongoose';
import { PostsSchemaInterface } from './posts.schemas';
import { bloggersSchema } from '../blogs/blogs.schemas';
import { likesSchemaInterface } from '../likes/likes.schemas';
import { commentsSchemaInterface } from '../comments/comments.schemas';
import { byDate } from '../sup/sortByDate';

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
    userId: string,
  ) {
    const skipCount = (pageNumber - 1) * pageSize;
    const totalCount = await this.postsRepository.countDocuments({
      isBanned: false,
    });

    const posts = await this.postsRepository
      .find({ isBanned: false }, '-_id -__v')
      .sort({ [sort]: sortDirection })
      .skip(skipCount)
      .limit(pageSize)
      .lean();

    const postsValidate = posts.map((p) => ({
      id: p.id,
      title: p.title,
      shortDescription: p.shortDescription,
      content: p.content,
      blogId: p.blogId,
      blogName: p.blogName,
      createdAt: p.createdAt,
      extendedLikesInfo: {
        likesCount:
          p.newestLikes?.filter(
            (s) => s.myStatus !== 'None' && s.myStatus !== 'Dislike',
          )?.length || 0,
        dislikesCount:
          p.newestLikes?.filter(
            (s) => s.myStatus !== 'Like' && s.myStatus !== 'None',
          )?.length || 0,
        myStatus:
          p.newestLikes?.find((u) => u.userId === userId)?.myStatus || 'None',
        newestLikes:
          p.newestLikes
            ?.filter((s) => s.myStatus !== 'None' && s.myStatus !== 'Dislike')
            ?.sort(byDate)
            ?.slice(0, 3)
            ?.map((post) => ({
              addedAt: post.addedAt,
              userId: post.userId,
              login: post.login,
            })) || [],
      },
    }));

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: postsValidate,
    };
  }

  async getPostId(postId: string, userId: string) {
    const post = await this.postsRepository.findOne(
      {
        $and: [{ id: postId }, { isBanned: false }],
      },
      '-_id -__v',
    );
    if (!post) {
      return null;
    }
    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount:
          post.newestLikes?.filter(
            (s) => s.myStatus !== 'None' && s.myStatus !== 'Dislike',
          )?.length || 0,
        dislikesCount:
          post.newestLikes?.filter(
            (s) => s.myStatus !== 'Like' && s.myStatus !== 'None',
          )?.length || 0,
        myStatus:
          post.newestLikes?.find((u) => u.userId === userId)?.myStatus ||
          'None',
        newestLikes:
          post.newestLikes
            ?.filter((s) => s.myStatus !== 'None' && s.myStatus !== 'Dislike')
            ?.sort(byDate)
            ?.slice(0, 3)
            ?.map((post) => ({
              addedAt: post.addedAt,
              userId: post.userId,
              login: post.login,
              // myStatus: post.myStatus,
            })) || [],
      },
    };
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
      .find({ $and: [{ idPostComment: postId }, { isBanned: false }] })
      .lean();
    if (allCommentsPost.length === 0) {
      throw new HttpException({ message: 'not found' }, HttpStatus.NOT_FOUND);
    }
    const skipCount = (pageNumber - 1) * pageSize;
    const post = await this.commentsRepository
      .find(
        { $and: [{ idPostComment: postId }, { isBanned: false }] },
        '-_id -__v -idPostComment',
      )
      .sort({ [sortBy]: sortDirection })
      .skip(skipCount)
      .limit(pageSize)
      .lean();

    const searchLike = post.map((p) => ({
      id: p.id,
      content: p.content,
      userId: p.userId,
      userLogin: p.userLogin,
      createdAt: p.createdAt,
      likesInfo: {
        likesCount:
          p.newestLikes?.filter(
            (s) => s.myStatus !== 'None' && s.myStatus !== 'Dislike',
          )?.length || 0,
        dislikesCount:
          p.newestLikes?.filter(
            (s) => s.myStatus !== 'Like' && s.myStatus !== 'None',
          )?.length || 0,
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
    userId: string,
  ) {
    const skipCount = (pageNumber - 1) * pageSize;
    const allPostsBlog = await this.postsRepository
      .find(
        {
          $and: [{ blogId: blogId }, { isBanned: false }],
        },
        '-_id -__v',
      )
      .sort({ [sort]: sortDirection })
      .skip(skipCount)
      .limit(pageSize)
      .lean();
    if (allPostsBlog.length === 0) {
      throw new HttpException({ message: ['not found'] }, HttpStatus.NOT_FOUND);
    }
    const post = await this.postsRepository.find(
      {
        $and: [{ blogId: blogId }, { 'blogOwnerInfo.isBanned': false }],
      },
      '-_id -__v',
    );

    const postValidate = allPostsBlog.map((post) => ({
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount:
          post.newestLikes?.filter(
            (s) => s.myStatus !== 'None' && s.myStatus !== 'Dislike',
          )?.length || 0,
        dislikesCount:
          post.newestLikes?.filter(
            (s) => s.myStatus !== 'Like' && s.myStatus !== 'None',
          )?.length || 0,
        myStatus:
          post.newestLikes?.find((u) => u.userId === userId)?.myStatus ||
          'None',
        newestLikes:
          post.newestLikes
            ?.map((post) => ({
              addedAt: post.addedAt,
              userId: post.userId,
              login: post.login,
              myStatus: post.myStatus,
            }))
            ?.filter((s) => s.myStatus !== 'None' && s.myStatus !== 'Dislike')
            ?.sort(byDate)
            ?.slice(0, 3)
            ?.map((p) => ({
              addedAt: p.addedAt,
              userId: p.userId,
              login: p.login,
            })) || [],
      },
    }));

    return {
      pagesCount: Math.ceil(post.length / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: post.length,
      items: postValidate,
    };
  }
  async createPost(bodyPosts: BodyCreatePostType, userId: string) {
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
        userId: userId,
        isBanned: false,
        newestLikes: [] as any,
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
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
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

  async likeStatusPost(
    postId: string,
    userId: string,
    login: string,
    status: string,
  ) {
    const post = await this.postsRepository.findOne({ id: postId });
    const findStatusUser = post.newestLikes.find((t) => t.userId === userId);
    if (!findStatusUser) {
      console.log('123');
      await this.postsRepository.updateOne(
        { id: postId },
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
      await this.postsRepository.updateOne(
        // { 'newestLikes.userId': userId },
        // {
        //   $set: {
        //     'newestLikes.$': {
        //       addedAt: new Date().toISOString(),
        //       userId: userId,
        //       login: login,
        //       myStatus: status,
        //     },
        //   },
        // },
        { $and: [{ id: postId }, { 'newestLikes.userId': userId }] },
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
  async banned(userId: string, banStatus: boolean) {
    return this.postsRepository.updateMany(
      { userId: userId },
      {
        $set: { isBanned: banStatus },
      },
    );
  }
  async deletePost(deletePostId: string) {
    return this.postsRepository.deleteOne({ id: deletePostId });
  }
  async deleteAll() {
    await this.postsRepository.deleteMany({});
    return;
  }
}
