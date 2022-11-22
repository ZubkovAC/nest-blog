import { Connection } from 'mongoose';
import { BloggersSchema } from './bloggers/blogger.schemas';
import { PostsSchema } from './posts/posts.schemas';
import { UsersSchema } from './users/users.schemas';
import { CommentsSchema } from './comments/comments.schemas';
import { LikesSchema } from './likes/likes.schemas';
import { DevicesAuthSchemas } from './authDevices/devicesAuth.schemas';

export const firstProviders = [
  {
    provide: 'BLOGGERS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('blogs', BloggersSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'POSTS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('posts', PostsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'USERS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('users', UsersSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'COMMENTS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('comments', CommentsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'LIKES_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('likes', LikesSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'DEVICES_AUTH',
    useFactory: (connection: Connection) =>
      connection.model('devicesAuth', DevicesAuthSchemas),
    inject: ['DATABASE_CONNECTION'],
  },
];
