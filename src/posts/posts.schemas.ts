import * as mongoose from 'mongoose';

export const PostsSchema = new mongoose.Schema({
  id: String,
  title: String,
  shortDescription: String,
  content: String,
  blogId: String,
  blogName: String,
  createdAt: String,
  userId: String,
  isBanned: Boolean,
  newestLikes: [
    {
      addedAt: String,
      userId: String,
      login: String,
      myStatus: String,
      isBanned: Boolean,
    },
  ],
});

export interface PostsSchemaInterface {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  userId: string;
  isBanned: boolean;
  newestLikes: [
    {
      addedAt: string;
      userId: string;
      login: string;
      myStatus: string;
      isBanned: boolean;
    },
  ];
}
