import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { BodyCreatePostType } from '../../posts/posts.controller';
import { PostsService } from '../../posts/posts.service';
import { BlogsService } from '../../blogs/blogs.service';
import { HttpException, HttpStatus } from '@nestjs/common';

export class usePostBloggersBlogsBlogIdPosts {
  constructor(
    public req: Request,
    public createPost: BodyCreatePostType,
    public blogId: string,
  ) {}
}

@CommandHandler(usePostBloggersBlogsBlogIdPosts)
export class PostBloggersBlogsBlogIdPosts
  implements ICommandHandler<usePostBloggersBlogsBlogIdPosts>
{
  constructor(
    private postsService: PostsService,
    private blogsService: BlogsService,
  ) {}
  async execute(command: usePostBloggersBlogsBlogIdPosts) {
    const { req, createPost, blogId } = command;
    const token = req.headers.authorization.split(' ')[1];
    const user: any = await jwt.verify(token, process.env.SECRET_KEY);

    const blog = await this.blogsService.findBlogIdAll(blogId);
    if (!blog) {
      throw new HttpException(
        { message: ['not found postId'] },
        HttpStatus.NOT_FOUND,
      );
    }
    if (user.userId !== blog.blogOwnerInfo.userId) {
      throw new HttpException({ message: ['FORBIDDEN'] }, HttpStatus.FORBIDDEN);
    }
    return this.postsService.createPost(
      {
        blogId,
        title: createPost.title,
        shortDescription: createPost.shortDescription,
        content: createPost.content,
      },
      user.userId,
    );
  }
}
