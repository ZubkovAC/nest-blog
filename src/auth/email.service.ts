import { add } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { AuthRepository } from './auth.repository';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class EmailService {
  constructor(protected authRepository: AuthRepository) {}
  async createUser(
    login: string,
    email: string,
    password: string,
    passwordAccess: string,
    passwordRefresh: string,
    userId: string,
    conformationCode: string,
    ip: string,
    title: string,
    isConfirmed?: boolean,
  ) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hashSync(password, salt);

    return {
      accountData: {
        userId: userId,
        login: login,
        email: email,
        createdAt: new Date(),
        // passwordAccess: passwordAccess,
        // passwordRefresh: passwordRefresh,
        hash: passwordHash,
        salt: salt,
        // lastActive: lastActive,
        // expActive: expDate,
        // ip: ip,
        // title: title,
        // deviceId: deviceId,
      },
      banInfo: {
        isBanned: false,
        banDate: null,
        banReason: null,
      },
      emailConformation: {
        conformationCode: conformationCode,
        expirationDate: add(new Date(), { minutes: 5 }),
        isConfirmed: isConfirmed ? isConfirmed : false,
      },
    };
  }
  async sendEmail(
    emailTo: string,
    url: string,
    params: string,
    conformationCode: string,
  ) {
    const transporter = await nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    let address = url;
    if (url === '::1') {
      address = 'http://localhost:3000';
    }
    await transporter.sendMail({
      from: `3y6kob <${process.env.EMAIL}>`, // sender address
      to: emailTo, // list of receivers
      subject: 'Registration ✔', // Subject line
      body: `<h1>To confirm registration, please, press the link below </h1>
      <a href='${address}/${params}?code=${conformationCode}'>Confirm registration</a>`,
      html: `<h1>To confirm registration, please, press the link below </h1>
      <a href='${address}/${params}?code=${conformationCode}'>Confirm registration</a>`,
      // <a href='https://nest-test-blog4412.vercel.app/auth/registration-confirmation?code=${conformationCode}'>Confirm registration</a>`,
    });
    return;
  }
  async sendNewPasswordEmail(
    emailTo: string,
    ip: string,
    params: string,
    conformationCode: string,
  ) {
    const transporter = await nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    let address = ip;
    if (ip === '::1') {
      address = 'http://localhost:3000';
    }
    await transporter.sendMail({
      from: `3y6kob <${process.env.EMAIL}>`, // sender address
      to: emailTo, // list of receivers
      subject: 'Password-recovery ✔', // Subject line
      body: `<h1>To confirm registration, please, press the link below </h1>
      <a href='${address}/${params}?code=${conformationCode}'>password-recovery</a>`,
      html: `<h1>To confirm registration, please, press the link below </h1>
      <a href='${address}/${params}?code=${conformationCode}'>password-recovery</a>`,
      // <a href='https://nest-test-blog4412.vercel.app/auth/password-recovery?recoveryCode=${conformationCode}'>Confirm registration</a>`,
    });
    return;
  }
}
