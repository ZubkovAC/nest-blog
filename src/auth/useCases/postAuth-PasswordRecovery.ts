import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../auth.repository';
import { AuthService } from '../auth.service';
import { EmailValidation } from '../auth.controller';

export class usePostAuthPasswordRecovery {
  constructor(public email: EmailValidation) {}
}

@CommandHandler(usePostAuthPasswordRecovery)
export class PostAuthPasswordRecovery
  implements ICommandHandler<usePostAuthPasswordRecovery>
{
  constructor(
    protected authRepository: AuthRepository,
    protected authService: AuthService,
  ) {}
  async execute(command: usePostAuthPasswordRecovery) {
    const { email } = command;
    const loginEmail = await this.authRepository.findUserEmail(email.email);
    if (!loginEmail) {
      // throw new HttpException(
      //   { message: ['email is not registered!!!'] },
      //   HttpStatus.BAD_REQUEST,
      // );
      return;
    }
    await this.authService.newPasswordCode(email.email);
    return;
  }
}
