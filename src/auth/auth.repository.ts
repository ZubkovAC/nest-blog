import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { UsersSchemaInterface } from '../users/users.schemas';
import { add } from 'date-fns';

export class AuthRepository {
  constructor(
    @Inject('USERS_MODEL')
    private authRepository: Model<UsersSchemaInterface>,
  ) {}
  async registration(newUser: UsersSchemaInterface) {
    await this.authRepository.insertMany([newUser]);
    return;
  }
  async registrationConformation(code: string) {
    await this.authRepository.updateOne(
      { 'emailConformation.conformationCode': code },
      { $set: { 'emailConformation.isConfirmed': true } },
    );
    return;
  }
  async emailResending(email: string, conformationCode: string) {
    await this.authRepository.updateOne(
      { 'accountData.email': email },
      {
        $set: {
          'emailConformation.conformationCode': conformationCode,
          'emailConformation.isConfirmed': false,
          'emailConformation.expirationDate': add(new Date(), { minutes: 5 }),
        },
      },
    );
    return;
  }

  async login(login: string, passwordAccess: string, passwordRefresh: string) {
    this.authRepository.updateOne(
      { 'accountData.login': login },
      {
        $set: {
          'accountData.passwordAccess': passwordAccess,
          'accountData.passwordRefresh': passwordRefresh,
        },
      },
    );
    return;
  }
  async refreshToken() {
    // this.authRepository
    return;
  }
  async logout() {
    // this.authRepository
    return;
  }
  async findUser(login: string) {
    return this.authRepository.findOne({ 'accountData.login': login });
  }
}
