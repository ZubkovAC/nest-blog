import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { UsersSchemaInterface } from '../users/users.schemas';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthBearerGuard implements CanActivate {
  constructor(
    @Inject('USERS_MODEL')
    private authRepository: Model<UsersSchemaInterface>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    let token;
    try {
      token = request.headers?.authorization.split(' ')[1];
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'UNAUTHORIZED',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (token) {
      let userId;
      try {
        userId = jwt.verify(token, process.env.SECRET_KEY);
      } catch (e) {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: 'UNAUTHORIZED',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      const login = await this.authRepository.findOne({
        'account.userId': userId.userId,
      });
      if (login) {
        return true;
      }
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
// @Injectable()
// export class AuthBearerCheckGuard implements CanActivate {
//   constructor(
//     @Inject('USERS_MODEL')
//     private authRepository: Model<UsersSchemaInterface>,
//   ) {}
//   async canActivate(context: ExecutionContext): Promise<any> {
//     const request = context.switchToHttp().getRequest();
//     let token;
//     try {
//       token = request.headers?.authorization.split(' ')[1];
//     } catch (e) {
//       throw new HttpException(
//         {
//           status: HttpStatus.UNAUTHORIZED,
//           error: 'UNAUTHORIZED',
//         },
//         HttpStatus.UNAUTHORIZED,
//       );
//     }
//     if (token) {
//       const login = await this.authRepository.findOne({
//         'account.passwordAccess': token,
//       });
//       if (login) {
//         return true;
//       }
//     }
//     throw new HttpException(
//       {
//         status: HttpStatus.UNAUTHORIZED,
//         error: 'UNAUTHORIZED',
//       },
//       HttpStatus.UNAUTHORIZED,
//     );
//   }
// }
