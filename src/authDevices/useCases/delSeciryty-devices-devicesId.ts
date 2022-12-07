import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { DevicesAuthService } from '../devicesAuth.service';

export class useDelSecurityDevicesDevicesId {
  constructor(public req: Request, public deviceId: string) {}
}

@CommandHandler(useDelSecurityDevicesDevicesId)
export class DelSecurityDevicesDevicesId
  implements ICommandHandler<useDelSecurityDevicesDevicesId>
{
  constructor(private devicesAuthService: DevicesAuthService) {}
  async execute(command: useDelSecurityDevicesDevicesId) {
    const token = command.req.cookies.refreshToken;
    let deviceTokenId;
    try {
      deviceTokenId = await jwt.verify(token, process.env.SECRET_KEY);
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
    const res = await this.devicesAuthService.findTokenDeviceId(
      command.deviceId,
    );
    if (!res) {
      throw new HttpException(
        {
          message: ['Not Found'],
        },
        HttpStatus.NOT_FOUND,
      );
    }
    if (res.userId !== deviceTokenId.userId) {
      throw new HttpException(
        {
          message: ['If try to delete the deviceId of other user'],
        },
        HttpStatus.FORBIDDEN,
      );
    }
    await this.devicesAuthService.deleteTokenDevices(command.deviceId);
    return;
  }
}
