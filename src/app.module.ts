import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { DevicesAuthController } from './authDevices/devicesAuth.controller';
import { DevicesAuthService } from './authDevices/devicesAuth.service';
import { DevicesAuthRepository } from './authDevices/devicesAuth.repository';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot(),
    // ThrottlerModule.forRoot({
    //   ttl: 10,
    //   limit: 5,
    // }),
  ],
  controllers: [
    AppController,
    AuthController,
    BlogsController,
    PostsController,
    UsersController,
    CommentsController,
    DevicesAuthController,
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
    DevicesAuthService,
    DevicesAuthRepository,
    EmailService,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
  exports: [],
})
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(PostsPOSTMiddleware).forRoutes('posts');
//   }
// }
export class AppModule {}
