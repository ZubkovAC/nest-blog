import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { BodyCreateUserType } from '../../users/users.controller';
import { UsersRepository } from '../../users/users.repository';
import { UsersService } from '../../users/users.service';

export class usePostSABlogs {
  constructor(
    public ip: string,
    public req: Request,
    public bodyCreateUser: BodyCreateUserType,
  ) {}
}

@CommandHandler(usePostSABlogs)
export class PostSABlogs implements ICommandHandler<usePostSABlogs> {
  constructor(
    private usersRepository: UsersRepository,
    private usersService: UsersService,
  ) {}
  async execute(command: usePostSABlogs) {
    const login = await this.usersRepository.findLogin(
      command.bodyCreateUser.login,
    );
    const email = await this.usersRepository.findEmail(
      command.bodyCreateUser.email,
    );
    if (login || email) {
      const error = [];
      if (login) {
        error.push('login is repeated');
      }
      if (email) {
        error.push('email is repeated');
      }
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
    const title = command.req.headers['user-agent'];
    return this.usersService.createUser(
      command.bodyCreateUser,
      command.ip,
      title,
    );
  }
}
