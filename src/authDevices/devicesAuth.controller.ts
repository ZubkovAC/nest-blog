import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Req,
} from '@nestjs/common';
import { DevicesAuthService } from './devicesAuth.service';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { ApiResponse } from '@nestjs/swagger';

@Controller('security')
export class DevicesAuthController {
  constructor(protected devicesAuthService: DevicesAuthService) {}
  @Get('/devices')
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      example: [
        {
          ip: 'string',
          title: 'string',
          lastActiveDate: 'string',
          deviceId: 'string',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description:
      'If the JWT refreshToken inside cookie is missing, expired or incorrect',
  })
  async getDeviseActive(@Req() req: Request) {
    const token = req.cookies.refreshToken;
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
  @HttpCode(204)
  @Delete('devices')
  @ApiResponse({
    status: 204,
    description: 'No Content',
  })
  @ApiResponse({
    status: 401,
    description:
      'If the JWT refreshToken inside cookie is missing, expired or incorrect',
  })
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
    await this.devicesAuthService.deleteAllTokenDevices(
      userId.userId,
      userId.deviceId,
    );
    return;
  }
  @HttpCode(204)
  @Delete('devices/:deviceId')
  @ApiResponse({
    status: 204,
    description: 'No Content',
  })
  @ApiResponse({
    status: 401,
    description:
      'If the JWT refreshToken inside cookie is missing, expired or incorrect',
  })
  @ApiResponse({
    status: 403,
    description: 'If try to delete the deviceId of other user',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
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
        HttpStatus.UNAUTHORIZED,
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
