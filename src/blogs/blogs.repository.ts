import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InputBlogType } from './blogs.controller';
import { Model } from 'mongoose';
import { bloggersSchema } from './blogs.schemas';

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
export class BloggerRepository {
  constructor(
    @Inject('BLOGGERS_MODEL')
    private blogRepository: Model<bloggersSchema>,
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
  async deleteAll() {
    await this.blogRepository.deleteMany({});
    return;
  }
}
