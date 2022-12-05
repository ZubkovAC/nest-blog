import mongoose from 'mongoose';

export const CommentsSchema = new mongoose.Schema({
  idPostComment: String,
  id: String,
  content: String,
  userId: String,
  userLogin: String,
  createdAt: String,
  isBanned: Boolean,
  newestLikes: [
    {
      addedAt: String,
      userId: String,
      login: String,
      myStatus: String,
      isBanned: Boolean,
      // myStatus: "None" || "Like" || "Dislike",
    },
  ],
});

export interface commentsSchemaInterface {
  idPostComment: string;
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: string;
  isBanned: boolean;
  newestLikes: [
    {
      addedAt: string;
      userId: string;
      login: string;
      myStatus: string;
      isBanned: boolean;
      // myStatus: "None" || "Like" || "Dislike",
    },
  ];
}
