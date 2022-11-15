import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('registration')
@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}
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
  async login(@Body() loginValue: LoginValueType) {
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
  async me() {
    return;
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
