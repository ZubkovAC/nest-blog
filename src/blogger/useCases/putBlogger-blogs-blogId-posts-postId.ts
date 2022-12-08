import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsService } from '../../blogs/blogs.service';
import { blogUpdateValue } from '../blogger.controller';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { PostsService } from '../../posts/posts.service';
import { Request } from 'express';

export class usePutBloggersBlogsBlogIdPostsPostId {
  constructor(
    public blogId: string,
    public postId: string,
    public blogUpdate: blogUpdateValue,
    public req: Request,
  ) {}
}

@CommandHandler(usePutBloggersBlogsBlogIdPostsPostId)
export class PutBloggersBlogsBlogIdPostsPostId
  implements ICommandHandler<usePutBloggersBlogsBlogIdPostsPostId>
{
  constructor(
    private blogsService: BlogsService,
    private postsService: PostsService,
  ) {}
  async execute(command: usePutBloggersBlogsBlogIdPostsPostId) {
    const { postId, blogId, blogUpdate, req } = command;
    const post = await this.postsService.getPostIdAllData(postId, '1');

    if (!post || post.blogId !== blogId) {
      throw new HttpException(
        { message: ['not found postId'] },
        HttpStatus.NOT_FOUND,
      );
    }
    const token = req.headers.authorization.split(' ')[1];
    const user: any = await jwt.verify(token, process.env.SECRET_KEY);
    if (user.userId !== post.userId) {
      throw new HttpException({ message: ['FORBIDDEN'] }, HttpStatus.FORBIDDEN);
    }
    await this.blogsService.updateBlogIdPostId(blogId, postId, blogUpdate);
    return;
  }
}
