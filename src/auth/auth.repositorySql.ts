import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { UsersSchemaInterface } from '../users/users.schemas';
import { add } from 'date-fns';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class AuthRepositorySql {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  // async registration(newUser: UsersSchemaInterface) {
  //   await this.authRepository.insertMany([newUser]);
  //   return;
  // }
  // async registrationConformation(code: string) {
  //   await this.authRepository.updateOne(
  //     { 'emailConformation.conformationCode': code },
  //     { $set: { 'emailConformation.isConfirmed': true } },
  //   );
  //   return true;
  // }
  // async registrationConformationFind(code: string) {
  // return this.authRepository.findOne({
  //   'emailConformation.conformationCode': code,
  // });
  // }
  // async emailResending(email: string, conformationCode: string) {
  // await this.authRepository.updateOne(
  //   { 'accountData.email': email },
  //   {
  //     $set: {
  //       'emailConformation.conformationCode': conformationCode,
  //       'emailConformation.isConfirmed': false,
  //       'emailConformation.expirationDate': add(new Date(), { minutes: 5 }),
  //     },
  //   },
  // );
  // return;
  // }
  // async emailFindResending(email: string) {
  //   return this.authRepository.findOne({ 'accountData.email': email });
  // }
  // async findRefreshToken(passwordRefresh: string) {
  //   return this.authRepository.findOne({
  //     'accountData.passwordRefresh': passwordRefresh,
  //   });
  // }

  // async login(
  //   login: string,
  //   passwordAccess: string,
  //   passwordRefresh: string,
  //   ip: string,
  //   title: string,
  // ) {
  // await this.authRepository.updateOne(
  //   { 'accountData.login': login },
  //   {
  //     $set: {
  //       'accountData.passwordAccess': passwordAccess,
  //       'accountData.passwordRefresh': passwordRefresh,
  //       'accountData.ip': ip,
  //       'accountData.title': title,
  //     },
  //   },
  // );
  //   return;
  // }
  // async logout(token: string) {
  // await this.authRepository.updateOne(
  //   { 'accountData.passwordRefresh': token },
  //   {
  //     $set: {
  //       'accountData.passwordAccess': (
  //         Math.random() *
  //         100 *
  //         Math.random()
  //       ).toString(),
  //       'accountData.passwordRefresh': (
  //         Math.random() *
  //         100 *
  //         Math.random()
  //       ).toString(),
  //     },
  //   },
  // );
  //   return;
  // }
  async findUserLogin(login: string) {
    console.log(login, 4423);
    const res = await this.dataSource.query(
      //` SELECT "is_banned" FROM users WHERE email=${login} OR login=${login}`,
      `SELECT *
                FROM users
                WHERE login = '${login}' OR email = '${login}'
                `,
    );
    return res;
  }
  // async findUserEmail(email: string) {
  //   return this.authRepository.findOne({ 'accountData.email': email }); WHERE "login" = ${login} OR email = ${login}
  // }
  // async newPasswordCode(email: string, conformationCode: string) {
  // await this.authRepository.updateOne(
  //   { 'accountData.email': email },
  //   {
  //     $set: {
  //       'emailConformation.conformationCode': conformationCode,
  //     },
  //   },
  // );
  //   return;
  // }
  // async newPassword(recoveryCode: string, salt: string, passwordHash: string) {
  // await this.authRepository.updateOne(
  //   { 'emailConformation.conformationCode': recoveryCode },
  //   {
  //     $set: {
  //       'emailConformation.conformationCode': (
  //         Math.random() *
  //         100 *
  //         Math.random()
  //       ).toString(),
  //       'accountData.salt': salt,
  //       'accountData.hash': passwordHash,
  //     },
  //   },
  // );
  //   return;
  // }
  // async deleteAll() {
  // await this.authRepository.deleteMany({});
  // return;
  // }
}
