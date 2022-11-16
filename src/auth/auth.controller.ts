import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class RegistrationValueType {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(3, 10)
  login: string;
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(6, 20)
  password: string;
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsEmail()
  email: string;
}
export class LoginValueType {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(3, 10)
  login: string;
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(6, 20)
  password: string;
}
class EmailValidation {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsEmail()
  email: string;
}

@ApiTags('registration')
@Controller('auth')
export class AuthController {
  constructor(
    protected authService: AuthService,
    protected authRepository: AuthRepository,
  ) {}
  @HttpCode(204)
  @Post('registration')
  async registration(@Body() registrationValueType: RegistrationValueType) {
    const loginName = await this.authRepository.findUserLogin(
      registrationValueType.login,
    );
    const loginEmail = await this.authRepository.findUserEmail(
      registrationValueType.email,
    );
    const error = [];
    if (loginName) {
      error.push('login this one is registered');
    }
    if (loginEmail) {
      error.push('email this one is registered');
    }
    if (error.length > 0) {
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
    await this.authService.registration(registrationValueType);
    return;
  }
  @HttpCode(204)
  @Post('registration-confirmation')
  async registrationConformation(@Body('code') code: string) {
    const res = await this.authRepository.registrationConformationFind(code);
    if (!res) {
      throw new HttpException(
        { message: ['code its not correct'] },
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.authService.registrationConformation(code);
    return;
  }
  @HttpCode(204)
  @Post('registration-email-resending')
  async registrationEmailResending(@Body() email: EmailValidation) {
    // const rex = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$');
    // const a = rex.test('vantreytest1@yandex.com');
    // console.log(a);
    const emailF = this.authRepository.emailFindResending(email.email);
    if (emailF) {
      await this.authService.emailResending(email.email);
      return;
    }
    throw new HttpException(
      { message: ['email its not correct'] },
      HttpStatus.BAD_REQUEST,
    );
  }
  @Post('login') // fix
  @HttpCode(200)
  async login(@Body() loginValue: LoginValueType) {
    const login = await this.authRepository.findUserLogin(loginValue.login);
    if (!login) {
      throw new UnauthorizedException();
    }
    const token = login.accountData;
    const verifyPassword = await bcrypt.compare(
      loginValue.password,
      token.hash,
    );
    if (!verifyPassword) {
      throw new UnauthorizedException();
    }
    const res = await this.authService.login(loginValue);
    return res;
  }
  @Post('refresh-token') // fix
  async refreshToken() {
    await this.authService.refreshToken();
    return;
  }
  @Post('logout') // fix
  async logout() {
    await this.authService.logout();
    return;
  }
  @Get('me') // fix
  async me(@Req() req: any) {
    const token = req.headers.authorization.split(' ')[1];
    let info;
    try {
      info = jwt.verify(token, process.env.SECRET_KEY);
    } catch (e) {
      throw new UnauthorizedException();
    }
    return {
      email: info.email,
      login: info.login,
      userId: info.userId,
    };
  }
}
