import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { Response } from 'express';
import { FastifyRequest } from 'fastify';

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
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
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
    if (!res || res.emailConformation.isConfirmed) {
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
    const emailF = await this.authRepository.emailFindResending(email.email);
    if (emailF && !emailF.emailConformation.isConfirmed) {
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
  async login(
    @Body() loginValue: LoginValueType,
    @Res({ passthrough: true }) response: Response,
    @Req() req: FastifyRequest,
  ) {
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
    const resLogin = await this.authService.login(loginValue);
    response.cookie('refreshToken', resLogin.passwordRefresh, {
      httpOnly: true,
      secure: true,
    });
    // console.log(req.cookies.refreshToken);
    return response.send({ accessToken: resLogin.accessToken });
  }
  @Post('refresh-token') // fix
  async refreshToken(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    // need logic
    const token = req.cookies;
    const findRefreshToken = await this.authRepository.findRefreshToken(
      token.refreshToken,
    );

    if (!findRefreshToken) {
      throw new HttpException(
        { message: ['unauthorized'] },
        HttpStatus.UNAUTHORIZED,
      );
    }
    let tokenValidate;
    try {
      tokenValidate = jwt.verify(token.refreshToken, process.env.SECRET_KEY);
    } catch (e) {
      throw new HttpException(
        { message: ['unauthorized'] },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const resLogin = await this.authService.login({
      login: tokenValidate.login,
      password: 'mock',
    });
    response.cookie('refreshToken', resLogin.passwordRefresh, {
      httpOnly: true,
      secure: true,
    });
    return response.send({ accessToken: resLogin.accessToken });
  }
  @HttpCode(204)
  @Post('logout') // fix
  async logout(
    @Res({ passthrough: true }) response: Response,
    @Req() req: any,
  ) {
    // need logic - black list ?
    const refreshToken = req.cookies.refreshToken;
    const refreshTokenUser = await this.authRepository.findRefreshToken(
      refreshToken,
    );
    if (!refreshTokenUser) {
      throw new HttpException(
        { message: ['Unauthorized'] },
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      const login = jwt.verify(refreshToken, process.env.SECRET_KEY);
    } catch (e) {
      throw new HttpException(
        { message: ['Unauthorized'] },
        HttpStatus.UNAUTHORIZED,
      );
    }
    await this.authRepository.logout(refreshToken);
    response.cookie('refreshToken', '', {
      httpOnly: true,
      secure: true,
    });
    return;
  }

  @Get('me') // fix
  async me(@Req() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
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
