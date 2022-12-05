import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginValueType, RegistrationValueType } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { createJWT, dateExpired } from '../sup/jwt';
import { EmailService } from './email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    protected authRepository: AuthRepository,
    protected emailService: EmailService,
  ) {}
  async getUser(login: string) {
    return this.authRepository.findUserLogin(login);
  }
  async registration(
    registrationValueType: RegistrationValueType,
    ip: string,
    title: string,
  ) {
    const { login, email, password } = registrationValueType;
    const userId = new mongoose.Types.ObjectId().toString();
    const conformationCode = uuidv4();
    const deviceId = uuidv4();
    const passwordAccess = await createJWT(
      { deviceId, userId, login, email },
      dateExpired['1h'],
    );
    const passwordRefresh = await createJWT(
      { deviceId, userId, login, email },
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
      ip,
      title,
    );
    try {
      const telegramEmail = await this.emailService.sendEmail(
        email,
        conformationCode,
      );
    } catch (e) {
      throw new HttpException(
        { message: ['sendmail'] },
        HttpStatus.BAD_REQUEST,
      );
    }

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
  async login(loginValue: LoginValueType, ip, title) {
    const { loginOrEmail, password } = loginValue; // need check password bcript
    const user = await this.authRepository.findUserLogin(loginOrEmail);
    const { userId, email, login } = user.accountData;
    const deviceId = uuidv4();
    const passwordAccess = await createJWT(
      { deviceId, userId, login, email },
      // dateExpired['2h'],
      dateExpired['10s'],
    );
    const passwordRefresh = await createJWT(
      { deviceId, userId, login, email },
      // dateExpired['48h'],
      dateExpired['20s'],
    );
    await this.authRepository.login(
      login,
      passwordAccess,
      passwordRefresh,
      ip,
      title,
    );
    return { accessToken: passwordAccess, passwordRefresh: passwordRefresh };
  }
  async newPasswordCode(email: string) {
    const conformationCode = uuidv4();
    await this.emailService.sendNewPasswordEmail(email, conformationCode);
    await this.authRepository.newPasswordCode(email, conformationCode);
  }
  async newPassword(recoveryCode: string, password: string) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hashSync(password, salt);
    await this.authRepository.newPassword(recoveryCode, salt, passwordHash);
    return;
  }
}
