import * as mongoose from 'mongoose';

export const PostsSchema = new mongoose.Schema({
  id: String,
  title: String,
  shortDescription: String,
  content: String,
  blogId: String,
  blogName: String,
  createdAt: String,
  newestLikes: [
    {
      addedAt: String,
      userId: String,
      login: String,
      myStatus: String,
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
  newestLikes: [
    {
      addedAt: string;
      userId: string;
      login: string;
      myStatus: string;
    },
  ];
}
