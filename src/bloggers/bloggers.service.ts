import { Injectable } from '@nestjs/common';
import { BloggerRepository } from './bloggers.repository';
import { InputBlogType, ValueBlogIdPostType } from './bloggers.controller';
import { Types } from 'mongoose';
import {
  pageNumberValidate,
  pageSizeValidate,
  termValidate,
} from '../query/query';
import { PostsRepository } from '../posts/posts.repository';

@Injectable()
export class BlogsService {
  constructor(
    protected bloggerRepository: BloggerRepository, // ???
    private postsRepository: PostsRepository,
  ) {}
  async getBlogs(
    pageNumber: string,
    pageSize: string,
    searchNameTerm: string,
    sort: string,
  ) {
    const pNumber = pageNumberValidate(pageNumber);
    const pSize = pageSizeValidate(pageSize);
    const searchNT = termValidate(searchNameTerm);
    return this.bloggerRepository.getBlogs(pNumber, pSize, searchNT, sort);
  }
  async getBlogId(bloggerId: string) {
    return this.bloggerRepository.findBlogId(bloggerId);
  }
  async getBlogIdPosts(
    bloggerId: string,
    pageNumber: string,
    pageSize: string,
    sort: string,
  ) {
    const pageN = pageNumberValidate(pageNumber);
    const pageS = pageSizeValidate(pageSize);
    return this.postsRepository.getBloggerIdPosts(
      bloggerId,
      pageN,
      pageS,
      sort,
    );
  }
  async createBlogIdPosts(
    blogId: string,
    valueBloggerIdPost: ValueBlogIdPostType,
  ) {
    const bloggerPost = {
      title: valueBloggerIdPost.title,
      shortDescription: valueBloggerIdPost.shortDescription,
      content: valueBloggerIdPost.content,
      blogId: blogId,
    };
    return this.postsRepository.createPost(bloggerPost); // createPost = blogger/{bloggerId}/posts
  }
  async deleteBlogId(bloggerId: string) {
    return this.bloggerRepository.deleteBlogId(bloggerId);
  }
  async updateBlogId(bloggerId: string, inputBlogType: InputBlogType) {
    return this.bloggerRepository.updateBlogId(bloggerId, inputBlogType);
  }
  async createBlog(inputBlogger: InputBlogType) {
    return this.bloggerRepository.createBlog({
      id: new Types.ObjectId().toString(),
      name: inputBlogger.name,
      youtubeUrl: inputBlogger.youtubeUrl,
      createdAt: new Date().toISOString(),
    });
  }
}
