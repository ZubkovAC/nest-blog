import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { DevicesAuthService } from '../devicesAuth.service';

export class useGetSecurityDevices {
  constructor(public req: Request) {}
}

@CommandHandler(useGetSecurityDevices)
export class GetSecurityDevices
  implements ICommandHandler<useGetSecurityDevices>
{
  constructor(private devicesAuthService: DevicesAuthService) {}
  async execute(command: useGetSecurityDevices) {
    const token = command.req.cookies.refreshToken;
    let userIdToken;
    try {
      userIdToken = await jwt.verify(token, process.env.SECRET_KEY);
    } catch (e) {
      throw new HttpException(
        { massage: ['refreshToken inside cookie is missing'] },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const tokens = await this.devicesAuthService.getAllToken(
      userIdToken.userId,
    );
    if (!tokens) {
      throw new HttpException(
        { message: ['refreshToken inside cookie is missing'] },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return tokens.map((t) => ({
      ip: t.ip,
      title: t.title,
      lastActiveDate: t.lastActive,
      deviceId: t.deviceId,
    }));
  }
}
