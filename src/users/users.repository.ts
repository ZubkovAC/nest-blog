import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UsersSchemaInterface } from './users.schemas';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject('USERS_MODEL')
    private usersRepository: Model<UsersSchemaInterface>,
  ) {}
  async getUsers(
    pageNumber: number,
    pageSize: number,
    sortBy: any,
    sortDirection: any,
    searchLoginTerm: string,
    searchEmailTerm: string,
  ) {
    const skipCount = (pageNumber - 1) * pageSize;
    const totalCount = await this.usersRepository.countDocuments({
      $or: [
        {
          'accountData.email': {
            $regex: searchEmailTerm,
            $options: 'i',
          },
        },
        {
          'accountData.login': {
            $regex: searchLoginTerm,
            $options: 'i',
          },
        },
      ],
    });

    const users = await this.usersRepository
      .find({
        $or: [
          {
            'accountData.email': {
              $regex: searchEmailTerm,
              $options: 'i',
            },
          },
          {
            'accountData.login': {
              $regex: searchLoginTerm,
              $options: 'i',
            },
          },
        ],
      })
      .sort({ [sortBy]: sortDirection })
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
        email: u.accountData.email,
        createdAt: u.accountData.createdAt,
        banInfo: u.banInfo,
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
      email: createUserModel.accountData.email,
      createdAt: createUserModel.accountData.createdAt,
    };
  }
  async deleteUser(deleteUserId: string) {
    return this.usersRepository.deleteOne({
      'accountData.userId': deleteUserId,
    });
  }
  async banUser(userId: string, isBanned: boolean, banReason: string) {
    const date = new Date().toString();
    await this.usersRepository.updateOne(
      { 'accountData.userId': userId },
      {
        $set: {
          banInfo: {
            isBanned: isBanned,
            banDate: date,
            banReason: banReason,
          },
        },
      },
    );
    return;
  }
}
