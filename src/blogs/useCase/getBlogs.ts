import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  pageNumberValidate,
  pageSizeValidate,
  sortBlogValidation,
  sortDirectionValidation,
  termValidate,
} from '../../query/query';
import { BlogsRepository } from '../blogs.repository';

export class useGetBlogs {
  constructor(
    public pageNumber: string,
    public pageSize: string,
    public searchNameTerm: string,
    public sort: string,
    public sortDirection: string,
  ) {}
}

@CommandHandler(useGetBlogs)
export class GetBlogs implements ICommandHandler<useGetBlogs> {
  constructor(private blogsRepository: BlogsRepository) {}
  async execute(command: useGetBlogs) {
    const pNumber = pageNumberValidate(command.pageNumber);
    const pSize = pageSizeValidate(command.pageSize);
    const searchNT = termValidate(command.searchNameTerm);
    const sortV = sortBlogValidation(command.sort);
    const sortD = sortDirectionValidation(command.sortDirection);
    return this.blogsRepository.getBlogs(
      pNumber,
      pSize,
      searchNT,
      sortV,
      sortD,
    );
  }
}
