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
import { GetSecurityDevices } from './authDevices/useCases/getSecurity-devices';
import { DelSecurityDevices } from './authDevices/useCases/delSecurity-devices';
import { DelSecurityDevicesDevicesId } from './authDevices/useCases/delSeciryty-devices-devicesId';
import { GetPosts } from './posts/useCases/getPosts';
import { GetPostsPostId } from './posts/useCases/getPosts-PostId';
import { PostPostsPostIdComments } from './posts/useCases/postPosts-postId-comments';
import { PutPostsPostIdLikeStatus } from './posts/useCases/putPosts-postId-likeStatus';
import { GetPostsPostIdComments } from './posts/useCases/getPosts-postId-comments';
import { DelSAUserId } from './superAdmin/useCases/delSA-users-id';
import { GetSABlogs } from './superAdmin/useCases/getSA-blogs';
import { GetSAUsers } from './superAdmin/useCases/getSA-users';
import { PostSABlogs } from './superAdmin/useCases/postSA-users';
import { PutSAUserIdBan } from './superAdmin/useCases/putSA-users-id-ban';
import { GetBloggersBlogs } from './blogger/useCases/getBlogger-blogs';
import { PostBloggersBlogs } from './blogger/useCases/postBlogger-blogs';
import { PutBloggersBlogsBlogId } from './blogger/useCases/putBlogger-blogs-blogId';
import { DelBloggersBlogsBlogId } from './blogger/useCases/delBlogger-blogs-blogId';
import { PostBloggersBlogsBlogIdPosts } from './blogger/useCases/postBlogger-blogs-blogId-posts';
import { PutBloggersBlogsBlogIdPostsPostId } from './blogger/useCases/putBlogger-blogs-blogId-posts-postId';
import { DelBloggersBlogsBlogIdPostPostId } from './blogger/useCases/delBlogger-blogs-blogId-posts-postId';

const useCasesBlogs = [GetBlogs, GetBlogsBlogId, GetBlogsBlogIdPosts];

const useCaseComments = [
  GetCommentsCommentsId,
  DeleteCommentsCommentsId,
  PutCommentsCommentsId,
  PutCommentsCommentsIdLikeStatus,
];

const useCasesSecurityDevices = [
  GetSecurityDevices,
  DelSecurityDevices,
  DelSecurityDevicesDevicesId,
];

const useCasesPosts = [
  GetPosts,
  GetPostsPostId,
  GetPostsPostIdComments,
  PostPostsPostIdComments,
  PutPostsPostIdLikeStatus,
];
const useCasesSuperAdmin = [
  GetSABlogs,
  GetSAUsers,
  PostSABlogs,
  PutSAUserIdBan,
  DelSAUserId,
];
const useCasesBlogger = [
  GetBloggersBlogs,
  PostBloggersBlogs,
  PutBloggersBlogsBlogId,
  DelBloggersBlogsBlogId,
  PostBloggersBlogsBlogIdPosts,
  PutBloggersBlogsBlogIdPostsPostId,
  DelBloggersBlogsBlogIdPostPostId,
];

const allService = [
  AppService,
  BlogsService,
  UsersService,
  PostsService,
  CommentsService,
  AuthService,
  DevicesAuthService,
  EmailService,
];
const allRepository = [
  BlogsRepository,
  UsersRepository,
  PostsRepository,
  CommentsRepository,
  CommentsService,
  AuthRepository,
  DevicesAuthRepository,
  LikesRepository,
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
    ...allService,
    ...allRepository,
    ...useCasesBlogs,
    ...useCaseComments,
    ...useCasesSecurityDevices,
    ...useCasesPosts,
    ...useCasesSuperAdmin,
    ...useCasesBlogger,
  ],
  exports: [],
})
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(PostsPOSTMiddleware).forRoutes('posts');
//   }
// }
export class AppModule {}
