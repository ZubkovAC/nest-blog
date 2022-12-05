import * as mongoose from 'mongoose';

export const BloggersSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  websiteUrl: String,
  createdAt: String,
  blogOwnerInfo: {
    userId: String,
    userLogin: String,
    isBanned: Boolean,
  },
});

export interface bloggersSchema {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  blogOwnerInfo: {
    userId: string;
    userLogin: string;
    isBanned: boolean;
  };
}
