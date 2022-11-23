import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DevicesAuthService } from './devicesAuth.service';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthBearerGuard } from '../guards/AuthBearer.guard';

@Controller('security')
export class DevicesAuthController {
  constructor(protected devicesAuthService: DevicesAuthService) {}
  @Get('/devices')
  async getDeviseActive(@Req() req: Request) {
    const token = req.cookies.refreshToken;
    const tokens = await this.devicesAuthService.getAllToken(token);
    if (!tokens || tokens.length === 0) {
      throw new HttpException(
        { message: ['not token'] },
        HttpStatus.BAD_REQUEST,
      );
    }
    return tokens.map((t) => ({
      ip: t.ip,
      title: t.title,
      lastActiveDate: t.lastActive,
      deviceId: t.deviceId,
    }));
  }
  @HttpCode(204)
  @Delete('devices')
  async getDevises(@Req() req: Request) {
    const token = req.cookies.refreshToken;
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
    await this.devicesAuthService.deleteAllTokenDevices(userId.userId);
    return;
  }

  @HttpCode(204)
  @Delete('devices/:deviceId')
  async getDeviseId(@Param('deviceId') deviceId: string, @Req() req: Request) {
    // need refactor
    console.log(deviceId);
    const token = req.cookies.refreshToken;
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
        HttpStatus.BAD_REQUEST,
      );
    }
    const res = await this.devicesAuthService.findTokenDeviceId(deviceId);
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
    await this.devicesAuthService.deleteTokenDevices(deviceId);
    return;
  }
}