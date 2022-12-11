import { Injectable } from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';
import { InputBlogType } from './blogs.controller';
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
import { blogUpdateValue } from '../blogger/blogger.controller';

@Injectable()
export class BlogsService {
  constructor(
    protected blogsRepository: BlogsRepository, // ???
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
    return this.blogsRepository.getBlogs(
      pNumber,
      pSize,
      searchNT,
      sortV,
      sortD,
    );
  }
  async getBlogsSA(
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
    return this.blogsRepository.getBlogsSA(
      pNumber,
      pSize,
      searchNT,
      sortV,
      sortD,
    );
  }
  async getBloggerBlogs(
    pageNumber: string,
    pageSize: string,
    searchNameTerm: string,
    sort: string,
    sortDirection: string,
    login: string,
  ) {
    const pNumber = pageNumberValidate(pageNumber);
    const pSize = pageSizeValidate(pageSize);
    const searchNT = termValidate(searchNameTerm);
    const sortV = sortBlogValidation(sort);
    const sortD = sortDirectionValidation(sortDirection);
    return this.blogsRepository.getBlogsForUser(
      pNumber,
      pSize,
      searchNT,
      sortV,
      sortD,
      login,
    );
  }
  async getBlogsComments(
    pageNumber: string,
    pageSize: string,
    sort: string,
    sortDirection: string,
    login: string,
    userId: string,
  ) {
    const pNumber = pageNumberValidate(pageNumber);
    const pSize = pageSizeValidate(pageSize);
    const sortV = sortBlogValidation(sort);
    const sortD = sortDirectionValidation(sortDirection);
    return this.blogsRepository.getBlogsComments(
      pNumber,
      pSize,
      sortV,
      sortD,
      login,
      userId,
    );
  }
  async getBlogsUsersBan(
    pageNumber: string,
    pageSize: string,
    sort: string,
    sortDirection: string,
    login: string,
    userId: string,
  ) {
    const pNumber = pageNumberValidate(pageNumber);
    const pSize = pageSizeValidate(pageSize);
    const sortV = sortBlogValidation(sort);
    const sortD = sortDirectionValidation(sortDirection);
    return this.blogsRepository.getBlogsUsersBan(
      pNumber,
      pSize,
      sortV,
      sortD,
      login,
      userId,
    );
  }
  async getBlogId(blogId: string) {
    return this.blogsRepository.findBlogId(blogId);
  }
  async findBlogIdAll(blogId: string) {
    return this.blogsRepository.findBlogIdAll(blogId);
  }
  async getBlogIdSA(bloggerId: string) {
    return this.blogsRepository.findBlogIdSA(bloggerId);
  }
  async getBlogIdPosts(
    bloggerId: string,
    pageNumber: string,
    pageSize: string,
    sort: string,
    sortDirection: string,
    userId: string,
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
      userId,
    );
  }
  // async createBlogIdPosts(
  //   blogId: string,
  //   valueBloggerIdPost: ValueBlogIdPostType,
  // ) {
  //   const bloggerPost = {
  //     title: valueBloggerIdPost.title,
  //     shortDescription: valueBloggerIdPost.shortDescription,
  //     content: valueBloggerIdPost.content,
  //     blogId: blogId,
  //   };
  //   return this.postsRepository.createPost(bloggerPost); // createPost = blogger/{bloggerId}/posts
  // }
  async deleteBlogId(bloggerId: string) {
    return this.blogsRepository.deleteBlogId(bloggerId);
  }
  async updateBlogId(bloggerId: string, inputBlogType: InputBlogType) {
    return this.blogsRepository.updateBlogId(bloggerId, inputBlogType);
  }
  async updateBlogIdPostId(
    bloggerId: string,
    postId: string,
    blogUpdate: blogUpdateValue,
  ) {
    return this.blogsRepository.updateBlogIdPostId(
      bloggerId,
      postId,
      blogUpdate,
    );
  }
  async createBlog(
    inputBlogger: InputBlogType,
    userId: string,
    userLogin: string,
  ) {
    return this.blogsRepository.createBlog({
      id: new Types.ObjectId().toString(),
      name: inputBlogger.name,
      description: inputBlogger.description,
      websiteUrl: inputBlogger.websiteUrl,
      createdAt: new Date().toISOString(),
      blogOwnerInfo: {
        userId: userId,
        userLogin: userLogin,
        isBanned: false,
        banDate: null,
      },
    });
  }
  async banned(userId: string, isBanned: boolean) {
    return this.blogsRepository.banned(userId, isBanned);
  }
  async updateBannedUserId(
    userId: string,
    isBanned: boolean,
    banReason: string,
    blogId: string,
  ) {
    return this.blogsRepository.updateBannedUser(
      userId,
      isBanned,
      banReason,
      blogId,
    );
  }
}
