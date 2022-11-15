// import {
//   CanActivate,
//   ExecutionContext,
//   HttpException,
//   HttpStatus,
//   Inject,
//   Injectable,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { Model } from 'mongoose';
// import { UsersSchemaInterface } from '../users/users.schemas';
//
// @Injectable()
// export class CheckUserGuard implements CanActivate {
//   constructor(
//     @Inject('USERS_MODEL')
//     private usersRepository: Model<UsersSchemaInterface>,
//   ) {}
//   async canActivate(
//     context: ExecutionContext,
//   )
//     // : boolean | Promise<boolean> | Observable<boolean>
//   {
//     const userId = this.usersRepository.findOne({"accountData.userId":  })
//     throw new HttpException(
//       {
//         status: HttpStatus.UNAUTHORIZED,
//         error: 'UNAUTHORIZED',
//       },
//       HttpStatus.UNAUTHORIZED,
//     );
//   }
// }
