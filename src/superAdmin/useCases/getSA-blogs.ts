import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsService } from '../../blogs/blogs.service';

export class useGetSABlogs {
  constructor(
    public pageNumber: string,
    public pageSize: string,
    public searchNameTerm: string,
    public sortBy: string,
    public sortDirection: string,
  ) {}
}

@CommandHandler(useGetSABlogs)
export class GetSABlogs implements ICommandHandler<useGetSABlogs> {
  constructor(private blogsService: BlogsService) {}
  async execute(command: useGetSABlogs) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      command;
    return this.blogsService.getBlogsSA(
      pageNumber,
      pageSize,
      searchNameTerm,
      sortBy,
      sortDirection,
    );
  }
}
