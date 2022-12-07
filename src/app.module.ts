import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsController } from './blogs/blogs.controller';
import { BlogsService } from './blogs/blogs.service';
import { BlogsRepository } from './blogs/blogs.repository';
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
import { LikesRepository } from './likes/likes.repository';
import { BloggerController } from './blogger/blogger.controller';
import { SuperAdminController } from './superAdmin/superAdmin.controller';
import { GetBlogs } from './blogs/useCase/getBlogs';
import { GetBlogsBlogId } from './blogs/useCase/getBlogs-blogId';
import { GetBlogsBlogIdPosts } from './blogs/useCase/getBlogs-blogId-posts';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteCommentsCommentsId } from './comments/useCases/deleteCommnets-commentId';
import { PutCommentsCommentsId } from './comments/useCases/putComments-commentId';
import { GetCommentsCommentsId } from './comments/useCases/getComments-commentId';
import { PutCommentsCommentsIdLikeStatus } from './comments/useCases/putComments-commentId-likeStatus';

const useCaseBlogs = [GetBlogs, GetBlogsBlogId, GetBlogsBlogIdPosts];
const useCaseComments = [
  GetCommentsCommentsId,
  DeleteCommentsCommentsId,
  PutCommentsCommentsId,
  PutCommentsCommentsIdLikeStatus,
];

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot(), CqrsModule],
  controllers: [
    AppController,
    AuthController,
    BlogsController,
    PostsController,
    UsersController,
    CommentsController,
    DevicesAuthController,
    TestingController,
    BloggerController,
    SuperAdminController,
  ],
  providers: [
    ...firstProviders,
    AppService,
    BlogsService,
    BlogsRepository,
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
    LikesRepository,
    ...useCaseBlogs,
    ...useCaseComments,
  ],
  exports: [],
})
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(PostsPOSTMiddleware).forRoutes('posts');
//   }
// }
export class AppModule {}
