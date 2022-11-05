import mongoose from 'mongoose';

export const CommentsSchema = new mongoose.Schema({
  idPostComment: String,
  id: String,
  content: String,
  userId: String,
  userLogin: String,
  addedAt: String,
});

export interface commentsSchemaInterface {
  idPostComment: string;
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  addedAt: string;
}
