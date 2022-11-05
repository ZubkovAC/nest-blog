import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { bloggers } from '../bloggers/bloggers.repository';
import { Model } from 'mongoose';
import { PostsSchemaInterface } from '../posts/posts.schemas';

@Injectable()
export class CheckPostIdGuard implements CanActivate {
  constructor(
    @Inject('POSTS_MODEL')
    private postsRepository: Model<PostsSchemaInterface>,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const findPostId = this.postsRepository.findOne({ id: request.params.id });
    if (findPostId) {
      return true;
    }
    throw new HttpException(
      {
        status: HttpStatus.NOT_FOUND,
        error: 'Not  Found PostId',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
