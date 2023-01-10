import { Injectable } from '@nestjs/common';
import { DevicesAuthRepository } from './devicesAuth.repository';
import { v4 as uuidv4 } from 'uuid';
import { createJWT, dateExpired } from '../sup/jwt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class DevicesAuthService {
  constructor(protected devicesAuthRepository: DevicesAuthRepository) {}
  async getAllToken(userId: string) {
    return await this.devicesAuthRepository.getAllToken(userId);
  }
  async loginDevices(
    userId: string,
    ip: string,
    login: string,
    email: string,
    title: string,
  ) {
    const deviceId = uuidv4();
    const lastActive = new Date().toISOString();
    const accessPassword = await createJWT(
      { deviceId, userId, login, email },
      // dateExpired['10s'],
      dateExpired['300s'],
    );
    const refreshPassword = await createJWT(
      { deviceId, userId, login, email },
      // dateExpired['20s'],
      dateExpired['48h'],
    );

    const expDate = await jwt.verify(refreshPassword, process.env.SECRET_KEY);
    //@ts-ignore
    const expDateISO = new Date(expDate.exp * 1000).toISOString();
    await this.devicesAuthRepository.createToken(
      userId,
      deviceId,
      ip,
      accessPassword,
      refreshPassword,
      lastActive,
      expDateISO,
      title,
    );
    return { passwordRefresh: refreshPassword, accessToken: accessPassword };
  }
  async findRefreshToken(refreshToken: string) {
    return this.devicesAuthRepository.getToken(refreshToken);
  }
  async findAccessToken(accessToken: string) {
    return this.devicesAuthRepository.getAccessToken(accessToken);
  }
  async findTokenDeviceId(deviceTokenId: string) {
    return this.devicesAuthRepository.getTokenDeviceId(deviceTokenId);
  }
  async updateDeviseId(refreshToken: string, ip: string, title: string) {
    const token: any = await jwt.verify(refreshToken, process.env.SECRET_KEY);
    return this.devicesAuthRepository.updateToken(
      token.userId,
      token.deviceId,
      token.login,
      token.email,
      ip,
      title,
    );
  }
  async logoutDevice(refreshToken: string) {
    const deviceId: any = await jwt.verify(
      refreshToken,
      process.env.SECRET_KEY,
    );
    await this.devicesAuthRepository.deleteToken(deviceId.deviceId);
    return;
  }
  async deleteTokenDevices(deviceId: string) {
    return await this.devicesAuthRepository.deleteToken(deviceId);
  }
  async deleteAllTokenDevices(userId: string, deviceId: string) {
    await this.devicesAuthRepository.deleteAllToken(userId, deviceId);
    return true;
  }
}
