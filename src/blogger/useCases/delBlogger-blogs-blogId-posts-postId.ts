import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsService } from '../../posts/posts.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

export class useDelBloggersBlogsBlogIdPostsPostId {
  constructor(
    public postId: string,
    public blogId: string,
    public req: Request,
  ) {}
}

@CommandHandler(useDelBloggersBlogsBlogIdPostsPostId)
export class DelBloggersBlogsBlogIdPostPostId
  implements ICommandHandler<useDelBloggersBlogsBlogIdPostsPostId>
{
  constructor(private postsService: PostsService) {}
  async execute(command: useDelBloggersBlogsBlogIdPostsPostId) {
    const { postId, blogId, req } = command;

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
    await this.postsService.deletePostId(postId);
    return;
  }
}
