import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsService } from '../../blogs/blogs.service';
import { blogUpdateValue } from '../blogger.controller';

export class usePutBloggersBlogsBlogIdPostsPostId {
  constructor(
    public blogId: string,
    public postId: string,
    public blogUpdate: blogUpdateValue,
  ) {}
}

@CommandHandler(usePutBloggersBlogsBlogIdPostsPostId)
export class PutBloggersBlogsBlogIdPostsPostId
  implements ICommandHandler<usePutBloggersBlogsBlogIdPostsPostId>
{
  constructor(private blogsService: BlogsService) {}
  async execute(command: usePutBloggersBlogsBlogIdPostsPostId) {
    const { postId, blogId, blogUpdate } = command;
    await this.blogsService.updateBlogIdPostId(blogId, postId, blogUpdate);
    return;
  }
}
