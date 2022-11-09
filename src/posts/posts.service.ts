import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { BodyCreatePostType } from './posts.controller';
import { pageNumberValidate, pageSizeValidate } from '../query/query';

@Injectable()
export class PostsService {
  constructor(protected postsRepository: PostsRepository) {}
  async getPosts(pageNumber: string, pageSize: string, sort: string) {
    const pNumber = pageNumberValidate(pageNumber);
    const pSize = pageSizeValidate(pageSize);
    return this.postsRepository.getPosts(pNumber, pSize, sort);
  }
  async getPostId(userId: string) {
    return this.postsRepository.getPostId(userId);
  }
  async getPostIdComments(
    postId: string,
    pageNumber: string,
    pageSize: string,
  ) {
    const pageN = pageNumberValidate(pageNumber);
    const pageS = pageSizeValidate(pageSize);
    return this.postsRepository.getPostIdComments(postId, pageN, pageS);
  }
  async createPost(bodyPosts: BodyCreatePostType) {
    return this.postsRepository.createPost(bodyPosts);
  }
  async updatePost(postId: string, updatePost: BodyCreatePostType) {
    return this.postsRepository.updatePostId(postId, updatePost);
  }
  async deletePostId(deletePostId: string) {
    return this.postsRepository.deletePost(deletePostId);
  }
}
