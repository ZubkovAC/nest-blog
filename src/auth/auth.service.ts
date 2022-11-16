import { Injectable } from '@nestjs/common';
import { LoginValueType, RegistrationValueType } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { createJWT, dateExpired } from '../sup/jwt';
import { EmailService } from './email.service';

@Injectable()
export class AuthService {
  constructor(
    protected authRepository: AuthRepository,
    protected emailService: EmailService,
  ) {}
  async registration(registrationValueType: RegistrationValueType) {
    const { login, email, password } = registrationValueType;
    const userId = new mongoose.Types.ObjectId().toString();
    const conformationCode = uuidv4();
    const passwordAccess = await createJWT(
      { userId, login, email },
      dateExpired['1h'],
    );
    const passwordRefresh = await createJWT(
      { userId, login, email },
      dateExpired['2h'],
    );
    const newUser = await this.emailService.createUser(
      login,
      email,
      password,
      passwordAccess,
      passwordRefresh,
      userId,
      conformationCode,
    );
    const telegramEmail = await this.emailService.sendEmail(
      email,
      conformationCode,
    );
    await this.authRepository.registration(newUser);
    return;
  }
  async registrationConformation(code: string) {
    return this.authRepository.registrationConformation(code);
  }
  async emailResending(email: string) {
    const conformationCode = uuidv4();
    await this.authRepository.emailResending(email, conformationCode);
    await this.emailService.sendEmail(email, conformationCode);
    return;
  }
  async login(loginValue: LoginValueType) {
    const { login, password } = loginValue; // need check password bcript
    const user = await this.authRepository.findUserLogin(login);
    const { userId, email } = user.accountData;
    const passwordAccess = await createJWT(
      { userId, login, email },
      dateExpired['1h'],
    );
    const passwordRefresh = await createJWT(
      { userId, login, email },
      dateExpired['2h'],
    );
    await this.authRepository.login(login, passwordAccess, passwordRefresh);
    return { accessToken: passwordAccess };
  }
  async refreshToken() {
    await this.authRepository.refreshToken();
    return;
  }
  async logout() {
    await this.authRepository.logout();
  }
}
