import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { BodyCreatePostType } from './posts.controller';
import {
  pageNumberValidate,
  pageSizeValidate,
  sortCommentsValidation,
  sortDirectionValidation,
  sortPostsValidation,
} from '../query/query';

@Injectable()
export class PostsService {
  constructor(protected postsRepository: PostsRepository) {}
  async getPosts(
    pageNumber: string,
    pageSize: string,
    sort: string,
    sortDirection: string,
    userId: string,
  ) {
    const pNumber = pageNumberValidate(pageNumber);
    const pSize = pageSizeValidate(pageSize);
    const sortV = sortPostsValidation(sort);
    const sortD = sortDirectionValidation(sortDirection);
    return this.postsRepository.getPosts(pNumber, pSize, sortV, sortD, userId);
  }
  async getPostId(postId: string, userId: string) {
    return this.postsRepository.getPostId(postId, userId);
  }
  async getPostIdAllData(postId: string, userId: string) {
    return this.postsRepository.getPostIdMainData(postId, userId);
  }
  async getPostIdComments(
    postId: string,
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
    userId: string,
  ) {
    const pageN = pageNumberValidate(pageNumber);
    const pageS = pageSizeValidate(pageSize);
    const sortB = sortCommentsValidation(sortBy);
    const sortD = sortDirectionValidation(sortDirection);
    return this.postsRepository.getPostIdComments(
      postId,
      pageN,
      pageS,
      sortB,
      sortD,
      userId,
    );
  }
  async createPost(bodyPosts: BodyCreatePostType, userId: string) {
    return this.postsRepository.createPost(bodyPosts, userId);
  }
  async updatePost(postId: string, updatePost: BodyCreatePostType) {
    return this.postsRepository.updatePostId(postId, updatePost);
  }
  async likeStatusPost(
    postId: string,
    userId: string,
    login: string,
    status: string,
  ) {
    return this.postsRepository.likeStatusPost(postId, userId, login, status);
  }
  async banned(userId: string, banStatus: boolean) {
    return this.postsRepository.banned(userId, banStatus);
  }
  async deletePostId(deletePostId: string) {
    return this.postsRepository.deletePost(deletePostId);
  }
}
