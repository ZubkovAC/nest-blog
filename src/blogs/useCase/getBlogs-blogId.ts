import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../blogs.repository';

export class useGetBlogsBlogId {
  constructor(public message: string) {}
}

@CommandHandler(useGetBlogsBlogId)
export class GetBlogsBlogId implements ICommandHandler<useGetBlogsBlogId> {
  constructor(private blogRepository: BlogsRepository) {}
  async execute(command: useGetBlogsBlogId) {
    return this.blogRepository.findBlogId(command.message);
  }
}
