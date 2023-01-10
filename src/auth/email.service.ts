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
    // const deviceId = uuidv4();
    const refresh = await jwt.verify(passwordRefresh, process.env.SECRET_KEY);
    // const lastActive = new Date().toISOString();
    //@ts-ignore
    const expDate = new Date(refresh.exp * 1000).toISOString();

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
    await transporter.sendMail({
      from: `3y6kob <${process.env.EMAIL}>`, // sender address
      to: emailTo, // list of receivers
      subject: 'Registration ✔', // Subject line
      // html: `<a href='https://nest-test-blog4412.vercel.app/auth/confirm-email?code=${conformationCode}'>complete registration</a>`,
      // html: `<h1>To confirm registration, please, press the link below </h1>
      //  <p>To finish registration please follow the link below:
      //     <a href='https://nest-test-blog4412.vercel.app/auth/confirm-email?code=${conformationCode}'>complete registration</a>
      // </p>`,
      body: `<h1>To confirm registration, please, press the link below </h1>
      <a href='https://dinasem.github.io/BlogsProject/#/registration-confirmation?code=${conformationCode}'>Confirm registration</a>`,
      html: `<h1>To confirm registration, please, press the link below </h1>
       <a href='https://dinasem.github.io/BlogsProject/#/registration-confirmation?code=${conformationCode}'>Confirm registration</a>`,
      // <a href='https://nest-test-blog4412.vercel.app/auth/registration-confirmation?code=${conformationCode}'>Confirm registration</a>`,

      // text: `https://some-front.com/confirm-registration?code=${conformationCode}`, // plain text body <a href='${config.linkBase}/auth/confirm-email?code=${code}'>complete registration</a>
    });
    return;
  }
  async sendNewPasswordEmail(emailTo: string, conformationCode: string) {
    const transporter = await nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    await transporter.sendMail({
      from: `3y6kob <${process.env.EMAIL}>`, // sender address
      to: emailTo, // list of receivers
      subject: 'Registration ✔', // Subject line
      // html: `<a href='https://nest-test-blog4412.vercel.app/auth/confirm-email?code=${conformationCode}'>complete registration</a>`,
      // html: `<h1>To confirm registration, please, press the link below </h1>
      //  <p>To finish registration please follow the link below:
      //     <a href='https://nest-test-blog4412.vercel.app/auth/confirm-email?code=${conformationCode}'>complete registration</a>
      // </p>`,
      body: `<h1>To confirm registration, please, press the link below </h1>
      <a href='https://dinasem.github.io/BlogsProject/#/password-recovery?recoveryCode=${conformationCode}'>Confirm registration</a>`,
      html: `<h1>To confirm registration, please, press the link below </h1>
      <a href='https://dinasem.github.io/BlogsProject/#/password-recovery?recoveryCode=${conformationCode}'>Confirm registration</a>`,

      // text: `https://some-front.com/confirm-registration?code=${conformationCode}`, // plain text body <a href='${config.linkBase}/auth/confirm-email?code=${code}'>complete registration</a>
    });
    return;
  }
}
