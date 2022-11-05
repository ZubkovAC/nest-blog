import { Inject, Injectable } from '@nestjs/common';
import { InputBloggerType } from './bloggers.controller';
import { Model, Types } from 'mongoose';
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
  async getBloggers(
    pageNumber: number,
    pageSize: number,
    searchNameTerm: string,
  ) {
    const skipCount = (pageNumber - 1) * pageSize;
    const query = { name: { $regex: searchNameTerm } };
    const totalCount = await this.blogRepository.countDocuments(query);

    const bloggersRestrict = await this.blogRepository
      .find({ query }, '-_id -__v')
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
  async findBloggerId(bloggerId: string) {
    return this.blogRepository.findOne({ id: bloggerId }, '-_id -__v').exec();
  }
  async deleteBloggerId(bloggerId: string) {
    await this.blogRepository.deleteOne({ id: bloggerId });
    return;
  }
  async updateBloggerId(bloggerId: string, inputBloggerType: InputBloggerType) {
    await this.blogRepository.updateOne({ id: bloggerId }, inputBloggerType);
    return {
      id: bloggerId,
      name: inputBloggerType.name,
      youtubeUrl: inputBloggerType.youtubeUrl,
    };
  }
  async createBlogger(inputBlogger: {
    id: string;
    name: string;
    youtubeUrl: string;
  }) {
    return this.blogRepository.insertMany([inputBlogger]);
  }
}
