import * as mongoose from 'mongoose';

export const PostsSchema = new mongoose.Schema({
  id: String,
  title: String,
  shortDescription: String,
  content: String,
  bloggerId: String,
  bloggerName: String,
  addedAt: String,
});

export interface PostsSchemaInterface {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: string;
  bloggerName: string;
  addedAt: string;
}
