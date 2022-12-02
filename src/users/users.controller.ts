import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Ip,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { IsEmail, Length } from 'class-validator';
import { AuthBaseGuard } from '../guards/AuthBase.guard';
import {
  ApiBasicAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Model } from 'mongoose';
import { UsersSchemaInterface } from './users.schemas';
import { Request, Response } from 'express';

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
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'pageNumber', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: 'asc || desc' })
  @ApiQuery({ name: 'sortDirection', required: false, type: 'params Object' })
  @ApiQuery({ name: 'searchLoginTerm', required: false, type: String })
  @ApiQuery({ name: 'searchEmailTerm', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      example: {
        pagesCount: 0,
        page: 0,
        pageSize: 0,
        totalCount: 0,
        items: [
          {
            id: 'string',
            login: 'string',
            email: 'string',
            createdAt: '2022-11-21T10:29:17.548Z',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getUsers(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Query('searchLoginTerm') searchLoginTerm: string,
    @Query('searchEmailTerm') searchEmailTerm: string,
    @Res({ passthrough: true }) response: Response,
  ) {
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
  @ApiBody({
    schema: {
      example: { login: 'string', password: 'string', email: 'string' },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Returns the newly created user',
    schema: {
      example: {
        id: 'string',
        login: 'string',
        email: 'string',
        createdAt: '2022-11-21T10:30:14.631Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'If the inputModel has incorrect values',
    schema: {
      example: {
        errorsMessages: [
          {
            message: 'string',
            field: 'string',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBasicAuth()
  @UseGuards(AuthBaseGuard)
  async createUser(
    @Body() bodyCreateUser: BodyCreateUserType,
    @Req() req: Request,
    @Ip() ip,
  ) {
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
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
    const title = req.headers['user-agent'];
    return this.usersService.createUser(bodyCreateUser, ip, title);
  }
  @Delete(':id')
  @ApiResponse({
    status: 204,
    description: 'No Content',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'If specified user is not exists',
  })
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
