import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthRepository } from '../auth.repository';
import { AuthService } from '../auth.service';
import { NewPasswordRecoveryInput } from '../auth.controller';

export class usePostAuthNewPassword {
  constructor(public newPasswordModel: NewPasswordRecoveryInput) {}
}

@CommandHandler(usePostAuthNewPassword)
export class PostAuthNewPassword
  implements ICommandHandler<usePostAuthNewPassword>
{
  constructor(
    protected authRepository: AuthRepository,
    protected authService: AuthService,
  ) {}
  async execute(command: usePostAuthNewPassword) {
    const { newPasswordModel } = command;
    const loginEmail = await this.authRepository.registrationConformationFind(
      newPasswordModel.recoveryCode,
    );
    if (!loginEmail) {
      throw new HttpException(
        { message: ['recoveryCode is incorrect or expired'] },
        HttpStatus.BAD_REQUEST,
      );
    }
    // need fix for new code only one
    await this.authService.newPassword(
      newPasswordModel.recoveryCode,
      newPasswordModel.newPassword,
    );
    return;
  }
}
