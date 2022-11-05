import * as mongoose from 'mongoose';

export const BloggersSchema = new mongoose.Schema({
  id: String,
  name: String,
  youtubeUrl: String,
});

export interface bloggersSchema {
  id: string;
  name: string;
  youtubeUrl: string;
}
