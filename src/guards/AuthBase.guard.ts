import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthBaseGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log('headers', request.headers?.authorization);
    const token = request.headers?.authorization;
    if (token === 'Basic YWRtaW46cXdlcnR5') {
      return true;
    }
    throw new HttpException(
      {
        status: HttpStatus.UNAUTHORIZED,
        error: 'UNAUTHORIZED',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
