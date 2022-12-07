import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsService } from '../../posts/posts.service';

export class useDelBloggersBlogsBlogIdPostsPostId {
  constructor(public postId: string, public blogId: string) {}
}

@CommandHandler(useDelBloggersBlogsBlogIdPostsPostId)
export class DelBloggersBlogsBlogIdPostPostId
  implements ICommandHandler<useDelBloggersBlogsBlogIdPostsPostId>
{
  constructor(private postsService: PostsService) {}
  async execute(command: useDelBloggersBlogsBlogIdPostsPostId) {
    const { postId, blogId } = command;
    await this.postsService.deletePostId(postId);
    return;
  }
}
