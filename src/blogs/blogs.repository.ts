import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InputBlogType } from './blogs.controller';
import { Model } from 'mongoose';
import { bloggersSchema } from './blogs.schemas';
import { blogUpdateValue } from '../blogger/blogger.controller';
import { PostsSchemaInterface } from '../posts/posts.schemas';
import { commentsSchemaInterface } from '../comments/comments.schemas';
import { UsersSchemaInterface } from '../users/users.schemas';

export const bloggers = [
  {
    id: 1,
    name: 'one',
    youtubeUrl: 'some1.com',
  },
  {
    id: 2,
    name: 'two',
    youtubeUrl: 'some2.com',
  },
  {
    id: 3,
    name: 'three',
    youtubeUrl: 'some3.com',
  },
];

@Injectable()
export class BlogsRepository {
  constructor(
    @Inject('BLOGGERS_MODEL')
    private blogRepository: Model<bloggersSchema>,
    @Inject('POSTS_MODEL')
    private postsRepository: Model<PostsSchemaInterface>,
    @Inject('COMMENTS_MODEL')
    private commentsRepository: Model<commentsSchemaInterface>,
    @Inject('USERS_MODEL')
    private usersRepository: Model<UsersSchemaInterface>,
  ) {}
  async getBlogs(
    pageNumber: number,
    pageSize: number,
    searchNameTerm: string,
    sort: any,
    sortDirection: any,
  ) {
    const skipCount = (pageNumber - 1) * pageSize;
    const totalCount = await this.blogRepository.countDocuments({
      name: { $regex: searchNameTerm, $options: 'i' },
      'banInfo.isBanned': false,
    });

    const bloggersRestrict = await this.blogRepository
      .find(
        {
          $and: [
            {
              name: {
                $regex: searchNameTerm,
                $options: 'i',
              },
            },
            {
              'blogOwnerInfo.isBanned': false,
            },
          ],
        },
        '-_id -__v -blogOwnerInfo',
      )
      .sort({ [sort]: sortDirection })
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
  async getBlogsSA(
    pageNumber: number,
    pageSize: number,
    searchNameTerm: string,
    sort: any,
    sortDirection: any,
  ) {
    const skipCount = (pageNumber - 1) * pageSize;
    const totalCount = await this.blogRepository.countDocuments({
      name: { $regex: searchNameTerm, $options: 'i' },
      'banInfo.isBanned': false,
    });

    const bloggersRestrict = await this.blogRepository
      .find(
        {
          $and: [
            {
              name: {
                $regex: searchNameTerm,
                $options: 'i',
              },
            },
            {
              'blogOwnerInfo.isBanned': false,
            },
          ],
        },
        '-_id -__v -blogOwnerInfo.isBanned',
      )
      .sort({ [sort]: sortDirection })
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

  async getBlogsComments(
    pageNumber: number,
    pageSize: number,
    sort: any,
    sortDirection: any,
    login: string,
    userId: string,
  ) {
    const blogger = await this.blogRepository.findOne({
      'blogOwnerInfo.userLogin': login,
    });
    const skipCount = (pageNumber - 1) * pageSize;
    const comments = await this.commentsRepository
      .find({
        'blogOwnerInfo.userLogin': login,
      })
      .sort({ [sort]: sortDirection })
      .skip(skipCount)
      .limit(pageSize)
      .lean();
    const posts = await this.postsRepository.find({
      userId: userId,
    });

    return {
      pagesCount: Math.ceil(comments.length || 0 / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: comments.length || 0,
      items: comments.map((c) => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        likesInfo: {
          likesCount:
            c.newestLikes?.filter(
              (s) =>
                s.myStatus !== 'None' &&
                s.myStatus !== 'Dislike' &&
                s.isBanned !== true,
            )?.length || 0,
          dislikesCount:
            c.newestLikes?.filter(
              (s) =>
                s.myStatus !== 'Like' &&
                s.myStatus !== 'None' &&
                s.isBanned !== true,
            )?.length || 0,
          myStatus:
            c.newestLikes?.find((u) => u.userId === userId)?.myStatus || 'None',
        },
        commentatorInfo: {
          userId: blogger.blogOwnerInfo.userId,
          userLogin: blogger.blogOwnerInfo.userLogin,
        },
        postInfo: {
          id: c.idPostComment,
          title: posts.find((p) => p.id === c.idPostComment).title, // need post
          blogId: blogger.id,
          blogName: blogger.name,
        },
      })),
    };
  }

  async getBlogsForUser(
    pageNumber: number,
    pageSize: number,
    searchNameTerm: string,
    sort: any,
    sortDirection: any,
    login: string,
  ) {
    const skipCount = (pageNumber - 1) * pageSize;
    const totalCount = await this.blogRepository.countDocuments({
      name: { $regex: searchNameTerm, $options: 'i' },
      'blogOwnerInfo.userLogin': login,
    });

    const bloggersRestrict = await this.blogRepository
      .find(
        {
          name: {
            $regex: searchNameTerm,
            $options: 'i',
          },
          'blogOwnerInfo.userLogin': login,
        },
        '-_id -__v -blogOwnerInfo',
      )
      .sort({ [sort]: sortDirection })
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
  async findBlogId(blogId: string) {
    const blog = await this.blogRepository
      .findOne(
        {
          $and: [
            { id: blogId },
            {
              'blogOwnerInfo.isBanned': false,
            },
          ],
        },
        '-_id -__v -blogOwnerInfo',
      )
      .exec();
    if (!blog) {
      throw new HttpException({ message: ['not found'] }, HttpStatus.NOT_FOUND);
    }
    return blog;
  }
  async findBlogIdAll(blogId: string) {
    const blog = await this.blogRepository
      .findOne(
        {
          $and: [
            { id: blogId },
            {
              'blogOwnerInfo.isBanned': false,
            },
          ],
        },
        '-_id -__v',
      )
      .exec();
    if (!blog) {
      throw new HttpException({ message: ['not found'] }, HttpStatus.NOT_FOUND);
    }
    return blog;
  }
  async findBlogIdSA(blogId: string) {
    const blog = await this.blogRepository
      .findOne(
        {
          $and: [
            { id: blogId },
            {
              'blogOwnerInfo.isBanned': false,
            },
          ],
        },
        '-_id -__v',
      )
      .exec();
    if (!blog) {
      throw new HttpException({ message: ['not found'] }, HttpStatus.NOT_FOUND);
    }
    return blog;
  }
  async deleteBlogId(bloggerId: string) {
    await this.blogRepository.deleteOne({ id: bloggerId });
    return;
  }
  async updateBlogId(bloggerId: string, inputBloggerType: InputBlogType) {
    await this.blogRepository.updateOne({ id: bloggerId }, inputBloggerType);
    return {
      id: bloggerId,
      name: inputBloggerType.name,
      description: inputBloggerType.description,
      websiteUrl: inputBloggerType.websiteUrl,
    };
  }
  async updateBlogIdPostId(
    bloggerId: string,
    postId: string,
    inputBloggerType: blogUpdateValue,
  ) {
    await this.postsRepository.updateOne(
      { id: postId },
      {
        $set: {
          title: inputBloggerType.title,
          shortDescription: inputBloggerType.shortDescription,
          content: inputBloggerType.content,
        },
      },
    );
    return;
  }
  async createBlog(inputBlogger: {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    blogOwnerInfo: {
      userId: string;
      userLogin: string;
      isBanned: boolean;
    };
  }) {
    const res = await this.blogRepository.insertMany([inputBlogger]);
    return res.map((blog) => ({
      id: blog.id,
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      // blogOwnerInfo: {
      //   userId: blog.blogOwnerInfo.userId,
      //   userLogin: blog.blogOwnerInfo.userLogin,
      // },
    }))[0];
  }
  async banned(userId: string, isBanned: boolean) {
    return this.blogRepository.updateMany(
      { 'blogOwnerInfo.userId': userId },
      { 'blogOwnerInfo.isBanned': isBanned },
    );
  }
  async updateBannedUser(
    userId: string,
    isBanned: boolean,
    banReason: string,
    blogId: string,
  ) {
    const blog = await this.blogRepository.findOne({ id: blogId });
    const findUser = blog.banUsers.find((b) => b.id === userId);
    const login = await this.usersRepository.findOne({
      'accountData.userId': userId,
    });
    const date = new Date().toISOString();
    if (!findUser) {
      await this.blogRepository.updateOne(
        { id: blogId },
        {
          $push: {
            id: userId,
            login: login.accountData.login, // need login
            banInfo: {
              isBanned: isBanned,
              banDate: date,
              banReason: banReason,
            },
          },
        },
      );
    } else {
      return this.blogRepository.updateOne(
        { $and: [{ id: blogId }, { 'banUsers.id': userId }] },
        {
          $unset: {
            'banUsers.$': { id: '', login: '', banInfo: '' },
          },
        },
      );
    }
  }
  async deleteAll() {
    await this.blogRepository.deleteMany({});
    return;
  }
}
