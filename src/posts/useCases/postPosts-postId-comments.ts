import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsService } from '../posts.service';
import { Request } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CommentsService } from '../../comments/comments.service';
import * as jwt from 'jsonwebtoken';
import { BlogsService } from '../../blogs/blogs.service';

export class usePostPostsPostIdComments {
  constructor(
    public req: Request,
    public postId: string,
    public content: string,
  ) {}
}

@CommandHandler(usePostPostsPostIdComments)
export class PostPostsPostIdComments
  implements ICommandHandler<usePostPostsPostIdComments>
{
  constructor(
    private postsService: PostsService,
    private commentsService: CommentsService,
    private blogsService: BlogsService,
  ) {}

  async execute(command: usePostPostsPostIdComments) {
    const { req, postId, content } = command;
    const post = await this.postsService.getPostId(postId, '123');
    if (!post) {
      throw new HttpException(
        { message: ['postId NOT_FOUND '] },
        HttpStatus.NOT_FOUND,
      );
    }
    if (
      !content?.trim() ||
      content.trim().length < 20 ||
      content.trim().length > 300
    ) {
      throw new HttpException(
        { message: ['content length > 20 && length  < 300'] },
        HttpStatus.BAD_REQUEST,
      );
    }
    const token: any = req.headers.authorization;
    const userToken = req.headers.authorization.split(' ')[1];
    const userId: any = await jwt.verify(userToken, process.env.SECRET_KEY);
    const blog = await this.blogsService.getBlogId(post.blogId);

    const banUser = blog.banUsers.find((b) => b.id === userId.userId);
    if (banUser) {
      throw new HttpException({ message: ['FORBIDDEN'] }, HttpStatus.FORBIDDEN);
    }
    return await this.commentsService.createCommentIdPost(
      postId,
      content,
      token,
    );
  }
}
