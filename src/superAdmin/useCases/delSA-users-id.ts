import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../../users/users.repository';
import { UsersService } from '../../users/users.service';

export class useDelSAUserId {
  constructor(public deleteUser: string) {}
}

@CommandHandler(useDelSAUserId)
export class DelSAUserId implements ICommandHandler<useDelSAUserId> {
  constructor(
    private usersService: UsersService,
    private usersRepository: UsersRepository,
  ) {}
  async execute(command: useDelSAUserId) {
    const userId = await this.usersRepository.getUserId(command.deleteUser);
    if (!userId) {
      throw new NotFoundException('not found');
    }
    return this.usersService.deleteUser(command.deleteUser);
  }
}
