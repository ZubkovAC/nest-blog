import { Request } from 'express';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RegistrationValueType } from '../auth.controller';
import { AuthRepository } from '../auth.repository';
import { AuthService } from '../auth.service';

export class usePostAuthRegistration {
  constructor(
    public req: Request,
    public registrationValueType: RegistrationValueType,
    public ip: string,
  ) {}
}

@CommandHandler(usePostAuthRegistration)
export class PostAuthRegistration
  implements ICommandHandler<usePostAuthRegistration>
{
  constructor(
    protected authRepository: AuthRepository,
    protected authService: AuthService,
  ) {}
  async execute(command: usePostAuthRegistration) {
    const { req, registrationValueType, ip } = command;
    const loginName = await this.authRepository.findUserLogin(
      registrationValueType.login,
    );
    const loginEmail = await this.authRepository.findUserEmail(
      registrationValueType.email,
    );
    const error = [];
    if (loginName) {
      error.push('login this one is registered');
    }
    if (loginEmail) {
      error.push('email this one is registered');
    }
    if (error.length > 0) {
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
    const title = req.headers['user-agent'];
    await this.authService.registration(
      registrationValueType,
      'registration-confirmation',
      ip,
      title,
    );
    return;
  }
}
