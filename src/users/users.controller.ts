import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { IsEmail, Length } from 'class-validator';
import { AuthBaseGuard } from '../guards/AuthBase.guard';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { UsersSchemaInterface } from './users.schemas';
import { Response } from 'express';

export class BodyCreateUserType {
  @Length(3, 10)
  login: string;
  @IsEmail()
  email: string;
  @Length(6, 20)
  password: string;
}
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    protected usersService: UsersService,
    @Inject('USERS_MODEL')
    private usersRepository: Model<UsersSchemaInterface>,
  ) {}
  @Get()
  @ApiBasicAuth()
  @UseGuards(AuthBaseGuard)
  async getUsers(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Query('searchLoginTerm') searchLoginTerm: string,
    @Query('searchEmailTerm') searchEmailTerm: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log('123');
    return this.usersService.getUsers(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    );
  }
  @Post()
  @ApiBasicAuth()
  @UseGuards(AuthBaseGuard)
  async createUser(@Body() bodyCreateUser: BodyCreateUserType) {
    const login = await this.usersRepository.findOne({
      'accountData.login': bodyCreateUser.login,
    });
    const email = await this.usersRepository.findOne({
      'accountData.email': bodyCreateUser.email,
    });
    if (login || email) {
      const error = [];
      if (login) {
        error.push('login is repeated');
      }
      if (email) {
        error.push('email is repeated');
      }
      throw new BadRequestException({ message: error });
    }
    return this.usersService.createUser(bodyCreateUser);
  }
  @Delete(':id')
  @UseGuards(AuthBaseGuard)
  @ApiBasicAuth()
  @HttpCode(204)
  async deleteUser(@Param('id') deleteUser: string) {
    const userId = await this.usersRepository.findOne({
      'accountData.userId': deleteUser,
    });
    if (!userId) {
      throw new NotFoundException('not found');
    }
    return this.usersService.deleteUser(deleteUser);
  }
}
