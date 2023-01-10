import { Request, Response } from 'express';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginValueType } from '../auth.controller';
import { AuthRepository } from '../auth.repository';
import { DevicesAuthService } from '../../authDevices/devicesAuth.service';
import { AuthRepositorySql } from '../auth.repositorySql';

export class usePostAuthLogin {
  constructor(
    public req: Request,
    public loginValue: LoginValueType,
    public ip: string,
    public response: Response,
  ) {}
}
@CommandHandler(usePostAuthLogin)
export class PostAuthLogin implements ICommandHandler<usePostAuthLogin> {
  constructor(
    // protected authRepository: AuthRepository,
    protected authRepository: AuthRepositorySql,
    protected devicesAuthService: DevicesAuthService,
  ) {}
  async execute(command: usePostAuthLogin) {
    const { req, loginValue, ip, response } = command;
    console.log('123');
    const login = await this.authRepository.findUserLogin(
      loginValue.loginOrEmail,
    );
    console.log('login', login);
    if (!login || login.banInfo.isBanned) {
      throw new UnauthorizedException();
    }
    const token = login.accountData;
    const verifyPassword = await bcrypt.compare(
      loginValue.password,
      token.hash,
    );
    if (!verifyPassword) {
      throw new UnauthorizedException();
    }
    const title = req.headers['user-agent'];
    const resLogin = await this.devicesAuthService.loginDevices(
      token.userId,
      ip,
      token.login,
      token.email,
      title,
    );
    response.cookie('refreshToken', resLogin.passwordRefresh, {
      sameSite: 'none',
      // httpOnly: true,
      secure: true,
      // secure: false,
    });
    return response.send({ accessToken: resLogin.accessToken });
  }
}
