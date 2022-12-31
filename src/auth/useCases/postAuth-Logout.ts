import { Request, Response } from 'express';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DevicesAuthService } from '../../authDevices/devicesAuth.service';
import * as jwt from 'jsonwebtoken';

export class usePostAuthLogout {
  constructor(public req: Request, public response: Response) {}
}

@CommandHandler(usePostAuthLogout)
export class PostAuthLogout implements ICommandHandler<usePostAuthLogout> {
  constructor(protected devicesAuthService: DevicesAuthService) {}
  async execute(command: usePostAuthLogout) {
    const { req, response } = command;
    const refreshToken = req.cookies.refreshToken;
    console.log('cookie', refreshToken);
    const refreshTokenUser = await this.devicesAuthService.findRefreshToken(
      refreshToken,
    );
    if (!refreshTokenUser) {
      throw new HttpException(
        { message: ['Unauthorized'] },
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const login = jwt.verify(refreshToken, process.env.SECRET_KEY);
    } catch (e) {
      throw new HttpException(
        { message: ['Unauthorized'] },
        HttpStatus.UNAUTHORIZED,
      );
    }
    await this.devicesAuthService.logoutDevice(refreshToken);

    response.cookie('refreshToken', '', {
      // httpOnly: true,
      // httpOnly: false
      sameSite: 'none',
      secure: true,
      // secure: false,
    });
    return;
  }
}
