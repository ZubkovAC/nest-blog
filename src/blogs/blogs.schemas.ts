import * as mongoose from 'mongoose';

export const BloggersSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  websiteUrl: String,
  createdAt: String,
});

export interface bloggersSchema {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
}
