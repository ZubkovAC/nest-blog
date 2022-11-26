import mongoose from 'mongoose';

export const CommentsSchema = new mongoose.Schema({
  idPostComment: String,
  id: String,
  content: String,
  userId: String,
  userLogin: String,
  createdAt: String,
  newestLikes: [
    {
      addedAt: String,
      userId: String,
      login: String,
      myStatus: String,
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
  newestLikes: [
    {
      addedAt: string;
      userId: string;
      login: string;
      myStatus: string;
      // myStatus: "None" || "Like" || "Dislike",
    },
  ];
}
