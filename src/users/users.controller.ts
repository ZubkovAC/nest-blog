import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { IsEmail, Length } from 'class-validator';
import { AuthBaseGuard } from '../guards/AuthBase.guard';
import { ApiTags } from '@nestjs/swagger';

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
  constructor(protected usersService: UsersService) {}
  @Get()
  getUsers(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.usersService.getUsers(pageNumber, pageSize);
  }
  @UseGuards(AuthBaseGuard)
  @Post()
  createUser(@Body() bodyCreateUser: BodyCreateUserType) {
    return this.usersService.createUser(bodyCreateUser);
  }
  @UseGuards(AuthBaseGuard)
  @Delete(':id')
  deleteUser(@Param('id') deleteUser: string) {
    return this.usersService.deleteUser(deleteUser);
  }
}
