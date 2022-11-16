import { add } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { AuthRepository } from './auth.repository';

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
        passwordAccess: passwordAccess,
        passwordRefresh: passwordRefresh,
        hash: passwordHash,
        salt: salt,
      },
      emailConformation: {
        conformationCode: conformationCode,
        expirationDate: add(new Date(), { minutes: 5 }),
        isConfirmed: isConfirmed ? isConfirmed : false,
      },
    };
  }
  async sendEmail(emailTo: string, conformationCode: string) {
    const transporter = await nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    transporter.sendMail({
      from: `3y6kob <${process.env.EMAIL}>`, // sender address
      to: emailTo, // list of receivers
      subject: 'Registration ✔', // Subject line
      html: `<a href='https://nest-test-blog4412.vercel.app/auth/confirm-email?code=${conformationCode}'>complete registration</a>`,
      // html: `<h1>Thank for your registration</h1>
      //  <p>To finish registration please follow the link below:
      //     <a href='https://nest-test-blog4412.vercel.app/auth/confirm-email?code=${conformationCode}'>complete registration</a>
      // </p>`,
      // text: `https://some-front.com/confirm-registration?code=${conformationCode}`, // plain text body <a href='${config.linkBase}/auth/confirm-email?code=${code}'>complete registration</a>
    });
    return;
  }
}
