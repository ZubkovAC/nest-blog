import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from '../../users/users.service';

export class useGetSAUsers {
  constructor(
    public banStatus: string,
    public searchLoginTerm: string,
    public searchEmailTerm: string,
    public pageNumber: string,
    public pageSize: string,
    public sortBy: string,
    public sortDirection: string,
  ) {}
}

@CommandHandler(useGetSAUsers)
export class GetSAUsers implements ICommandHandler<useGetSAUsers> {
  constructor(private usersService: UsersService) {}
  async execute(command: useGetSAUsers) {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
      banStatus,
    } = command;
    return this.usersService.getUsers(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
      banStatus,
    );
  }
}
