import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { BodyCreateUserType } from './users.controller';
import {
  pageNumberValidate,
  pageSizeValidate,
  searchValidation,
  sortDirectionValidation,
  sortUserValidation,
} from '../query/query';
import mongoose from 'mongoose';
import { createJWT, dateExpired } from '../sup/jwt';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '../auth/email.service';

@Injectable()
export class UsersService {
  constructor(
    protected usersRepository: UsersRepository,
    protected emailService: EmailService,
  ) {}
  async getUsers(
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
    searchLoginTerm: string,
    searchEmailTerm: string,
  ) {
    const pNumber = pageNumberValidate(pageNumber);
    const pSize = pageSizeValidate(pageSize);
    const sortB = sortUserValidation(sortBy);
    const sortD = sortDirectionValidation(sortDirection);
    const searchLTerm = searchValidation(searchLoginTerm);
    const searchETerm = searchValidation(searchEmailTerm);
    return this.usersRepository.getUsers(
      pNumber,
      pSize,
      sortB,
      sortD,
      searchLTerm,
      searchETerm,
    ); // need class Repository / count + page +++
  }
  async createUser(bodyCreateUser: BodyCreateUserType) {
    const userId = new mongoose.Types.ObjectId().toString();
    const { login, email, password } = bodyCreateUser;
    const passwordAccess = await createJWT(
      { userId, login, email },
      dateExpired['1h'],
    );
    const passwordRefresh = await createJWT(
      { userId, login, email },
      dateExpired['2h'],
    );
    const conformitedCode = uuidv4();
    const createUserModel = await this.emailService.createUser(
      login,
      email,
      password,
      passwordAccess,
      passwordRefresh,
      userId,
      conformitedCode,
      true,
    );
    return this.usersRepository.createUser(createUserModel); // need class Repository / count + page +++
  }
  async deleteUser(deleteUserId: string) {
    return this.usersRepository.deleteUser(deleteUserId); // need class Repository / count + page +++
  }
}
