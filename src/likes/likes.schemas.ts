import mongoose from 'mongoose';

export const LikesSchema = new mongoose.Schema({
  id: String, // post comments
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

export interface likesSchemaInterface {
  id: string; // post comments
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
