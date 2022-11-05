import { Injectable } from '@nestjs/common';
import { BloggerRepository } from './bloggers.repository';
import {
  InputBloggerType,
  ValueBloggerIdPostType,
} from './bloggers.controller';
import { Types } from 'mongoose';
import {
  pageNumberValidate,
  pageSizeValidate,
  termValidate,
} from '../query/query';
import { PostsRepository } from '../posts/posts.repository';

@Injectable()
export class BloggersService {
  constructor(
    protected bloggerRepository: BloggerRepository, // ???
    private postsRepository: PostsRepository,
  ) {}
  async getBloggers(
    pageNumber: string,
    pageSize: string,
    searchNameTerm: string,
  ) {
    const pNumber = pageNumberValidate(pageNumber);
    const pSize = pageSizeValidate(pageSize);
    const searchNT = termValidate(searchNameTerm);
    return this.bloggerRepository.getBloggers(pNumber, pSize, searchNT);
  }
  async getBloggerId(bloggerId: string) {
    return this.bloggerRepository.findBloggerId(bloggerId);
  }
  async getBloggerIdPosts(
    bloggerId: string,
    pageNumber: string,
    pageSize: string,
  ) {
    const pageN = pageNumberValidate(pageNumber);
    const pageS = pageSizeValidate(pageSize);
    return this.postsRepository.getBloggerIdPosts(bloggerId, pageN, pageS);
  }
  async createBloggerIdPosts(
    bloggerId: string,
    valueBloggerIdPost: ValueBloggerIdPostType,
  ) {
    const bloggerPost = {
      title: valueBloggerIdPost.title,
      shortDescription: valueBloggerIdPost.shortDescription,
      content: valueBloggerIdPost.content,
      bloggerId: bloggerId,
    };
    return this.postsRepository.createPost(bloggerPost); // createPost = blogger/{bloggerId}/posts
  }
  async deleteBloggerId(bloggerId: string) {
    return this.bloggerRepository.deleteBloggerId(bloggerId);
  }
  async updateBloggerId(bloggerId: string, inputBloggerType: InputBloggerType) {
    return this.bloggerRepository.updateBloggerId(bloggerId, inputBloggerType);
  }
  async createBlogger(inputBlogger: InputBloggerType) {
    return this.bloggerRepository.createBlogger({
      id: new Types.ObjectId().toString(),
      name: inputBlogger.name,
      youtubeUrl: inputBlogger.youtubeUrl,
    });
  }
}
