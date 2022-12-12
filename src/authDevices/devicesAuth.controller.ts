import { Controller, Delete, Get, HttpCode, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { useGetSecurityDevices } from './useCases/getSecurity-devices';
import { CommandBus } from '@nestjs/cqrs';
import { useDelSecurityDevices } from './useCases/delSecurity-devices';
import { useDelSecurityDevicesDevicesId } from './useCases/delSeciryty-devices-devicesId';

@ApiTags('Devices auth')
@Controller('security')
export class DevicesAuthController {
  constructor(private commandBus: CommandBus) {}
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
    return this.commandBus.execute(new useGetSecurityDevices(req));
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
    return this.commandBus.execute(new useDelSecurityDevices(req));
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
    return this.commandBus.execute(
      new useDelSecurityDevicesDevicesId(req, deviceId),
    );
  }
}
