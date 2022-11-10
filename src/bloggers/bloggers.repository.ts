import { Inject, Injectable } from '@nestjs/common';
import { InputBlogType } from './bloggers.controller';
import { Model } from 'mongoose';
import { bloggersSchema } from './blogger.schemas';

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
    const query = { name: { $regex: searchNameTerm } };
    const totalCount = await this.blogRepository.countDocuments(query);
    const bloggersRestrict = await this.blogRepository
      // .find({ query }, '-_id -__v')
      .find({ name: { $regex: searchNameTerm } }, '-_id -__v')
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
  async findBlogId(bloggerId: string) {
    return this.blogRepository.findOne({ id: bloggerId }, '-_id -__v').exec();
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
      youtubeUrl: inputBloggerType.youtubeUrl,
    };
  }
  async createBlog(inputBlogger: {
    id: string;
    name: string;
    youtubeUrl: string;
    createdAt: string;
  }) {
    const res = await this.blogRepository.insertMany([inputBlogger]);
    return res.map((blog) => ({
      id: blog.id,
      name: blog.name,
      youtubeUrl: blog.youtubeUrl,
      createdAt: blog.createdAt,
    }))[0];
  }
  async deleteAll() {
    await this.blogRepository.deleteMany({});
    return;
  }
}
