import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { DevicesAuthService } from '../devicesAuth.service';

export class useDelSecurityDevices {
  constructor(public req: Request) {}
}

@CommandHandler(useDelSecurityDevices)
export class DelSecurityDevices
  implements ICommandHandler<useDelSecurityDevices>
{
  constructor(private devicesAuthService: DevicesAuthService) {}
  async execute(command: useDelSecurityDevices) {
    const token = command.req.cookies.refreshToken;
    let userId;
    try {
      userId = await jwt.verify(token, process.env.SECRET_KEY);
    } catch (e) {
      throw new HttpException(
        {
          message: [
            'If the JWT refreshToken inside cookie is missing, expired or incorrect',
          ],
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    await this.devicesAuthService.deleteAllTokenDevices(
      userId.userId,
      userId.deviceId,
    );
    return;
  }
}
