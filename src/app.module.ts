import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsController } from './bloggers/bloggers.controller';
import { BlogsService } from './bloggers/bloggers.service';
import { BloggerRepository } from './bloggers/bloggers.repository';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersRepository } from './users/users.repository';
import { PostsController } from './posts/posts.controller';
import { PostsRepository } from './posts/posts.repository';
import { PostsService } from './posts/posts.service';
import { DatabaseModule } from './connectRepository/databese.module';
import { firstProviders } from './first.provider';
import { ConfigModule } from '@nestjs/config';
import { CommentsController } from './comments/comments.controller';
import { CommentsService } from './comments/comments.service';
import { CommentsRepository } from './comments/comments.repository';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthRepository } from './auth/auth.repository';
import { EmailService } from './auth/email.service';
import { TestingController } from './testing/testing.controller';
import { PostsPOSTMiddleware } from './middleware/middleware.module';

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot()],
  controllers: [
    AppController,
    BlogsController,
    UsersController,
    PostsController,
    CommentsController,
    AuthController,
    TestingController,
  ],
  providers: [
    ...firstProviders,
    AppService,
    BlogsService,
    BloggerRepository,
    UsersService,
    UsersRepository,
    PostsService,
    PostsRepository,
    CommentsService,
    CommentsRepository,
    AuthService,
    AuthRepository,
    EmailService,
  ],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PostsPOSTMiddleware).forRoutes('posts');
    // .forRoutes({
    //   path: 'posts',
    //   method: RequestMethod.POST,
    // })
    // .forRoutes({ path: 'posts', method: RequestMethod.PUT });
  }
}

// export class AppModule
