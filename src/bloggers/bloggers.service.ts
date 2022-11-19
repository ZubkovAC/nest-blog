import { Injectable } from '@nestjs/common';
import { BloggerRepository } from './bloggers.repository';
import { InputBlogType, ValueBlogIdPostType } from './bloggers.controller';
import { Types } from 'mongoose';
import {
  pageNumberValidate,
  pageSizeValidate,
  sortDirectionValidation,
  sortBlogValidation,
  termValidate,
  sortPostsValidation,
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
    sortDirection: string,
  ) {
    const pNumber = pageNumberValidate(pageNumber);
    const pSize = pageSizeValidate(pageSize);
    const searchNT = termValidate(searchNameTerm);
    const sortV = sortBlogValidation(sort);
    const sortD = sortDirectionValidation(sortDirection);
    return this.bloggerRepository.getBlogs(
      pNumber,
      pSize,
      searchNT,
      sortV,
      sortD,
    );
  }
  async getBlogId(bloggerId: string) {
    return this.bloggerRepository.findBlogId(bloggerId);
  }
  async getBlogIdPosts(
    bloggerId: string,
    pageNumber: string,
    pageSize: string,
    sort: string,
    sortDirection: string,
  ) {
    const pageN = pageNumberValidate(pageNumber);
    const pageS = pageSizeValidate(pageSize);
    const sortV = sortPostsValidation(sort);
    const sortD = sortDirectionValidation(sortDirection);
    return this.postsRepository.getBloggerIdPosts(
      bloggerId,
      pageN,
      pageS,
      sortV,
      sortD,
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
      description: inputBlogger.description,
      websiteUrl: inputBlogger.websiteUrl,
      createdAt: new Date().toISOString(),
    });
  }
}
