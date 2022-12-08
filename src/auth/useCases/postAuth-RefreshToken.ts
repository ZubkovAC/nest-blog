import { Request, Response } from 'express';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { DevicesAuthService } from '../../authDevices/devicesAuth.service';

export class usePostAuthRefreshToken {
  constructor(
    public req: Request,
    public response: Response,
    public ip: string,
  ) {}
}

@CommandHandler(usePostAuthRefreshToken)
export class PostAuthRefreshToken
  implements ICommandHandler<usePostAuthRefreshToken>
{
  constructor(protected devicesAuthService: DevicesAuthService) {}
  async execute(command: usePostAuthRefreshToken) {
    const { req, response, ip } = command;
    const token = req.cookies;
    const findRefreshToken = await this.devicesAuthService.findRefreshToken(
      token.refreshToken,
    );
    if (!findRefreshToken) {
      throw new HttpException(
        { message: ['unauthorized'] },
        HttpStatus.UNAUTHORIZED,
      );
    }
    let tokenValidate;
    try {
      tokenValidate = jwt.verify(token.refreshToken, process.env.SECRET_KEY);
    } catch (e) {
      throw new HttpException(
        { message: ['unauthorized'] },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const title = req.headers['user-agent'];
    const resLogin = await this.devicesAuthService.updateDeviseId(
      token.refreshToken,
      ip,
      title,
    );
    response.cookie('refreshToken', resLogin.passwordRefresh, {
      httpOnly: true,
      secure: true,
    });
    return response.send({ accessToken: resLogin.accessToken });
  }
}
