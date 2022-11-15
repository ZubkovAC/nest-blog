import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { createJWT } from '../sup/jwt';
import * as jwt from 'jsonwebtoken';

@ApiTags('registration')
@Controller('auth')
export class AuthController {
  constructor(
    protected authService: AuthService,
    protected authRepository: AuthRepository,
  ) {}
  @Post('registration')
  async registration(@Body() registrationValueType: RegistrationValueType) {
    await this.authService.registration(registrationValueType);
    return;
  }
  @Post('registration-confirmation')
  async registrationConformation(@Body() code: string) {
    await this.authService.registrationConformation(code);
    return;
  }
  @Post('registration-email-resending')
  async registrationEmailResending(@Body() email: string) {
    await this.authService.emailResending(email);
    return;
  }
  @Post('login') // fix
  @HttpCode(200)
  async login(@Body() loginValue: LoginValueType) {
    const login = await this.authRepository.findUser(loginValue.login);
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

export type LoginValueType = {
  login: string;
  password: string;
};
export type RegistrationValueType = {
  login: string;
  email: string;
  password: string;
};
