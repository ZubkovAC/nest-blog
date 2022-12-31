import { Request } from 'express';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DevicesAuthService } from '../../authDevices/devicesAuth.service';

export class useGetAuthMe {
  constructor(public req: Request) {}
}

@CommandHandler(useGetAuthMe)
export class GetAuthMe implements ICommandHandler<useGetAuthMe> {
  constructor(protected devicesAuthService: DevicesAuthService) {}
  async execute(command: useGetAuthMe) {
    const { req } = command;
    const token = req.headers?.authorization?.split(' ')[1];
    let info;
    try {
      info = jwt.verify(token, process.env.SECRET_KEY);
    } catch (e) {
      throw new HttpException(
        { message: ['Unauthorized'] },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const findAccessToken = await this.devicesAuthService.findAccessToken(
      token,
    );
    if (!findAccessToken) {
      throw new HttpException(
        { message: ['Unauthorized'] },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return {
      email: info.email,
      login: info.login,
      userId: info.userId,
    };
  }
}
