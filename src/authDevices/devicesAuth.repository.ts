import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { devicesAuthSchemasInterface } from './devicesAuth.schemas';
import { createJWT, dateExpired } from '../sup/jwt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class DevicesAuthRepository {
  constructor(
    @Inject('DEVICES_AUTH')
    private devicesAuthRepository: Model<devicesAuthSchemasInterface>,
  ) {}
  async createToken(
    userId: string,
    deviceId: string,
    ip: string,
    accessPassword: string,
    refreshPassword: string,
    lastActive: string,
    expActive: string,
    title: string,
  ) {
    await this.devicesAuthRepository.insertMany([
      {
        userId,
        deviceId,
        ip,
        accessPassword,
        refreshPassword,
        lastActive,
        expActive,
        title,
      },
    ]);
    return;
  }
  async updateToken(
    userId: string,
    deviceId: string,
    login: string,
    email: string,
    ip: string,
    title: string,
  ) {
    const accessPassword = await createJWT(
      { deviceId, userId, login, email },
      dateExpired['10s'],
    );
    const refreshPassword = await createJWT(
      { deviceId, userId, login, email },
      dateExpired['20s'],
    );
    const lastActive = new Date().toISOString();
    const expActiveToken = await jwt.verify(
      refreshPassword,
      process.env.SECRET_KEY,
    );
    //@ts-ignore
    const expActive = new Date(expActiveToken.exp * 1000).toISOString();
    await this.devicesAuthRepository.updateOne(
      { deviceId: deviceId },
      {
        accessPassword: accessPassword,
        refreshPassword: refreshPassword,
        ip: ip,
        lastActive: lastActive,
        expActive: expActive,
        title: title,
      },
    );
    return { accessToken: accessPassword, passwordRefresh: refreshPassword };
  }
  async getToken(refreshToken: string) {
    console.log(refreshToken);
    return this.devicesAuthRepository.findOne({
      refreshPassword: refreshToken,
    });
  }
  async deleteToken(deviceId: string) {
    return this.devicesAuthRepository.deleteMany({ deviceId: deviceId });
  }
  async deleteAllToken(userId: string) {
    return this.devicesAuthRepository.deleteMany({ userId: userId });
  }
  async getAllToken(userId: string) {
    return this.devicesAuthRepository.find({ userId: userId });
  }
}
