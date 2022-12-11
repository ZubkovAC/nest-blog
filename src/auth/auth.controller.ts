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
import {
  ApiBearerAuth,
  ApiBody,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { Response, Request } from 'express';
import { DevicesAuthService } from '../authDevices/devicesAuth.service';
import { useGetAuthMe } from './useCases/getAuth-Me';
import { CommandBus } from '@nestjs/cqrs';
import { usePostAuthLogin } from './useCases/postAuth-Login';
import { usePostAuthLogout } from './useCases/postAuth-Logout';
import { usePostAuthRegistration } from './useCases/postAuth-Registration';
import { usePostAuthRegistrationConfirmation } from './useCases/postAuth-RegistrationConfirmation';
import { usePostAuthRefreshToken } from './useCases/postAuth-RefreshToken';
import { usePostAuthRegistrationEmailResending } from './useCases/postAuth-RegistrationEmailResenging';
import { usePostAuthNewPassword } from './useCases/postAuth-NewPassword';
import { usePostAuthPasswordRecovery } from './useCases/postAuth-PasswordRecovery';

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
export class EmailValidation {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
export class NewPasswordRecoveryInput {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(6, 20)
  newPassword: string;
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  recoveryCode: string;
}
@ApiTags('registration')
@Controller('auth')
export class AuthController {
  constructor(
    protected commandBus: CommandBus,
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
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
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
    return this.commandBus.execute(
      new usePostAuthRegistration(req, registrationValueType, ip),
    );
  }
  @HttpCode(204)
  @Post('registration-confirmation')
  @ApiResponse({
    status: 204,
    description: 'Email was verified. Account was activated',
  })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
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
    await this.commandBus.execute(
      new usePostAuthRegistrationConfirmation(code),
    );
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
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
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
  async registrationEmailResending(@Body() email: EmailValidation) {
    return this.commandBus.execute(
      new usePostAuthRegistrationEmailResending(email),
    );
  }
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
    status: 200,
    description:
      'Returns JWT accessToken + cookie refreshToken (http-only, secure)',
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
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  async login(
    @Body() loginValue: LoginValueType,
    @Res({ passthrough: true }) response: Response,
    @Req() req: Request,
    @Ip() ip,
  ) {
    return this.commandBus.execute(
      new usePostAuthLogin(req, loginValue, ip, response),
    );
  }
  @HttpCode(200)
  @Post('refresh-token') // fix
  @ApiResponse({
    status: 200,
    description:
      'Returns JWT accessToken + cookie refreshToken (http-only, secure)',
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
    return this.commandBus.execute(
      new usePostAuthRefreshToken(req, response, ip),
    );
  }

  @HttpCode(204)
  @Post('logout')
  @ApiResponse({
    status: 204,
    description:
      "Even if current email is not registered (for prevent user's email detection)",
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
    await this.commandBus.execute(new usePostAuthLogout(req, response));
    return;
  }

  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description:
      "Even if current email is not registered (for prevent user's email detection)",
  })
  @ApiResponse({
    status: 400,
    description:
      'If the inputModel has invalid email (for example 222^gmail.com)',
  })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  @Post('password-recovery')
  async passwordRecovery(@Body() email: EmailValidation) {
    return this.commandBus.execute(new usePostAuthPasswordRecovery(email));
  }

  @HttpCode(204)
  @Post('new-password')
  @ApiResponse({
    status: 204,
    description:
      "Even if current email is not registered (for prevent user's email detection)",
  })
  @ApiResponse({
    status: 400,
    description:
      'If the inputModel has invalid email (for example 222^gmail.com)',
  })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  async newPassword(@Body() newPasswordModel: NewPasswordRecoveryInput) {
    return this.commandBus.execute(
      new usePostAuthNewPassword(newPasswordModel),
    );
  }

  @ApiBearerAuth()
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
    return this.commandBus.execute(new useGetAuthMe(req));
  }
}
