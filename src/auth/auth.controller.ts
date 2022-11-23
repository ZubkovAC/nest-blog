import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Ip,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { Response, Request } from 'express';
import { DevicesAuthService } from '../authDevices/devicesAuth.service';

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
  @Length(3, 30)
  loginOrEmail: string;
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
// @SkipThrottle()
@Controller('auth')
export class AuthController {
  constructor(
    protected authService: AuthService,
    protected authRepository: AuthRepository,
    protected devicesAuthService: DevicesAuthService,
  ) {}
  @HttpCode(204)
  @ApiBody({
    schema: {
      example: {
        login: 'string Length(3, 10)',
        password: 'string Length(6, 20)',
        email: 'string ^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
      },
    },
  })
  @ApiResponse({
    status: 204,
    description:
      'Input data is accepted. Email with confirmation code will be send to passed email address',
  })
  @ApiResponse({
    status: 400,
    description: 'Not Found',
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
  @Post('registration')
  async registration(
    @Body() registrationValueType: RegistrationValueType,
    @Req() req: Request,
    @Ip() ip,
  ) {
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
    const title = req.headers['user-agent'];
    await this.authService.registration(registrationValueType, ip, title);
    return;
  }
  @HttpCode(204)
  @Post('registration-confirmation')
  @ApiResponse({
    status: 204,
    description: 'Email was verified. Account was activated',
  })
  @ApiResponse({
    status: 400,
    description: 'Not Found',
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
  @ApiBody({
    schema: {
      example: {
        code: 'string',
      },
    },
  })
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
  @ApiResponse({
    status: 204,
    description:
      'Input data is accepted. Email with confirmation code will be send to passed email address.',
  })
  @ApiBody({
    schema: {
      example: {
        email: 'string',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Not Found',
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
  // @Throttle(5, 10)
  @Post('login') // fix
  @HttpCode(200)
  @ApiBody({
    schema: {
      example: {
        accessToken: 'string',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Not Found',
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
    description: 'If the password or login is wrong',
  })
  async login(
    @Body() loginValue: LoginValueType,
    @Res({ passthrough: true }) response: Response,
    @Req() req: Request,
    @Ip() ip,
  ) {
    const login = await this.authRepository.findUserLogin(
      loginValue.loginOrEmail,
    );
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
    const title = req.headers['user-agent'];
    const resLogin = await this.devicesAuthService.loginDevices(
      token.userId,
      ip,
      token.login,
      token.email,
      title,
    );
    response.cookie('refreshToken', resLogin.passwordRefresh, {
      // httpOnly: true,
      // secure: true,
    });
    return response.send({ accessToken: resLogin.accessToken });
  }
  @HttpCode(200)
  // @Throttle(5, 10)
  @Post('refresh-token') // fix
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        accessToken: 'string',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description:
      'If the JWT refreshToken inside cookie is missing, expired or incorrect',
  })
  async refreshToken(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
    @Ip() ip,
  ) {
    // need logic
    const token = req.cookies;
    const findRefreshToken = await this.devicesAuthService.findRefreshToken(
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
    const title = req.headers['user-agent'];
    const resLogin = await this.devicesAuthService.updateDeviseId(
      token.refreshToken,
      ip,
      title,
    );
    response.cookie('refreshToken', resLogin.passwordRefresh, {
      // httpOnly: true,
      // secure: true,
    });
    return response.send({ accessToken: resLogin.accessToken });
  }

  @HttpCode(204)
  @Post('logout') // fix
  @ApiResponse({
    status: 204,
    description: 'No Content',
  })
  @ApiResponse({
    status: 401,
    description:
      'If the JWT refreshToken inside cookie is missing, expired or incorrect',
  })
  async logout(
    @Res({ passthrough: true }) response: Response,
    @Req() req: any,
  ) {
    // need logic - black list ?
    const refreshToken = req.cookies.refreshToken;
    const refreshTokenUser = await this.devicesAuthService.findRefreshToken(
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
    await this.devicesAuthService.logoutDevice(refreshToken);
    response.cookie('refreshToken', '', {
      httpOnly: true,
      secure: true,
    });
    return;
  }

  @Get('me') // fix
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      example: { email: 'string', login: 'string', userId: 'string' },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async me(@Req() req: Request) {
    const token = req.headers?.authorization?.split(' ')[1];
    let info;
    try {
      info = jwt.verify(token, process.env.SECRET_KEY);
    } catch (e) {
      throw new HttpException(
        { message: ['Unauthorized'] },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return {
      email: info.email,
      login: info.login,
      userId: info.userId,
    };
  }
}
