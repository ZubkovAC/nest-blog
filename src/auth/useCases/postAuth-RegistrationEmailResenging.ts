import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthRepository } from '../auth.repository';
import { AuthService } from '../auth.service';
import { EmailValidation } from '../auth.controller';

export class usePostAuthRegistrationEmailResending {
  constructor(public email: EmailValidation, public ip: string) {}
}

@CommandHandler(usePostAuthRegistrationEmailResending)
export class PostAuthRegistrationEmailResending
  implements ICommandHandler<usePostAuthRegistrationEmailResending>
{
  constructor(
    protected authRepository: AuthRepository,
    protected authService: AuthService,
  ) {}
  async execute(command: usePostAuthRegistrationEmailResending) {
    const { email, ip } = command;
    const emailF = await this.authRepository.emailFindResending(email.email);
    if (emailF && !emailF.emailConformation.isConfirmed) {
      await this.authService.emailResending(
        email.email,
        ip,
        'registration-email-resending',
      );
      return;
    }
    throw new HttpException(
      { message: ['email its not correct'] },
      HttpStatus.BAD_REQUEST,
    );
  }
}
