import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthRepository } from '../auth.repository';
import { AuthService } from '../auth.service';

export class usePostAuthRegistrationConfirmation {
  constructor(public code: string) {}
}

@CommandHandler(usePostAuthRegistrationConfirmation)
export class PostAuthRegistrationConfirmation
  implements ICommandHandler<usePostAuthRegistrationConfirmation>
{
  constructor(
    protected authRepository: AuthRepository,
    protected authService: AuthService,
  ) {}
  async execute(command: usePostAuthRegistrationConfirmation) {
    const { code } = command;
    const res = await this.authRepository.registrationConformationFind(code);
    if (!res || res.emailConformation.isConfirmed) {
      throw new HttpException(
        { message: ['code its not correct'] },
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.authService.registrationConformation(code);
    return;
  }
}
