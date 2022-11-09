import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { bloggersSchema } from '../bloggers/blogger.schemas';

@Injectable()
export class CheckBloggerIdGuard implements CanActivate {
  constructor(
    @Inject('BLOGGERS_MODEL')
    private blogService: Model<bloggersSchema>,
  ) {}
  async canActivate(
    context: ExecutionContext, // : boolean | Promise<boolean> | Observable<boolean>
  ) {
    const request = context.switchToHttp().getRequest();
    const findBloggerId = await this.blogService
      .findOne({ id: request.params.blogId }, '-_id -__v')
      .exec();
    if (findBloggerId) {
      return true;
    }
    throw new HttpException(
      {
        status: HttpStatus.NOT_FOUND,
        error: 'Not  Found BloggerId',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

@Injectable()
export class CheckBloggerIdPostIdGuard implements CanActivate {
  constructor(
    @Inject('BLOGGERS_MODEL')
    private blogService: Model<bloggersSchema>,
  ) {}
  async canActivate(
    context: ExecutionContext, // : boolean | Promise<boolean> | Observable<boolean>
  ) {
    const request = context.switchToHttp().getRequest();
    const findBloggerId = await this.blogService
      .findOne({ id: request.body.blogId })
      .exec();
    if (findBloggerId) {
      return true;
    }
    throw new HttpException(
      {
        status: HttpStatus.NOT_FOUND,
        error: 'Not  Found BloggerId',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
