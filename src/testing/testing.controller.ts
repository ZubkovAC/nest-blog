import { Controller, Delete, HttpCode } from '@nestjs/common';
import { PostsRepository } from '../posts/posts.repository';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BloggerRepository } from '../bloggers/bloggers.repository';
import { AuthRepository } from '../auth/auth.repository';
import { CommentsRepository } from '../comments/comments.repository';

@ApiTags('testing')
@Controller('testing')
export class TestingController {
  constructor(
    protected postsRepository: PostsRepository,
    protected blogsRepository: BloggerRepository,
    protected authRepository: AuthRepository,
    protected commentsRepository: CommentsRepository,
  ) {}
  @Delete('/all-data')
  @ApiResponse({
    status: 204,
    description: 'All data is deleted',
  })
  @HttpCode(204)
  async deleteAllData() {
    await this.postsRepository.deleteAll();
    await this.blogsRepository.deleteAll();
    await this.authRepository.deleteAll();
    await this.commentsRepository.deleteAll();
    return;
  }
}
