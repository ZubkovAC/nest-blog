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
    banDate: String,
  },
  banUsers: [
    {
      id: String,
      login: String,
      banInfo: {
        isBanned: Boolean,
        banDate: String,
        banReason: String,
      },
    },
  ],
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
    banDate: string;
  };
  banUsers: [
    {
      id: string;
      login: string;
      banInfo: {
        isBanned: boolean;
        banDate: string;
        banReason: string;
      };
    },
  ];
}
