import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UsersSchemaInterface } from './users.schemas';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject('USERS_MODEL')
    private usersRepository: Model<UsersSchemaInterface>,
  ) {}
  async getUsers(pageNumber: number, pageSize: number) {
    const skipCount = (pageNumber - 1) * pageSize;
    const totalCount = await this.usersRepository.countDocuments();
    const users = await this.usersRepository
      .find({})
      .skip(skipCount)
      .limit(pageSize)
      .lean();
    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: users.map((u) => ({
        id: u.accountData.userId,
        login: u.accountData.login,
      })),
    };
  }
  async getUserId(userId: string) {
    return this.usersRepository.findOne({ 'accountData.userId': userId });
  }
  async createUser(createUserModel: UsersSchemaInterface) {
    await this.usersRepository.insertMany([createUserModel]);
    return {
      id: createUserModel.accountData.userId,
      login: createUserModel.accountData.login,
    };
  }
  async deleteUser(deleteUserId: string) {
    return this.usersRepository.deleteOne({
      'accountData.userId': deleteUserId,
    });
  }
}
