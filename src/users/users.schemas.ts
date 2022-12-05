import * as mongoose from 'mongoose';

export const UsersSchema = new mongoose.Schema({
  accountData: {
    userId: String,
    login: String,
    email: String,
    createdAt: Date,
    hash: String,
    salt: String,
    // passwordAccess: String,
    // passwordRefresh: String,
    // lastActive: String, // new
    // expActive: String, // new
    // ip: String, // new
    // title: String, // new
    // deviceId: String, // new
  },
  banInfo: {
    isBanned: Boolean,
    banDate: String,
    banReason: String,
  },
  emailConformation: {
    conformationCode: String,
    expirationDate: Date,
    isConfirmed: Boolean,
  },
});

export interface UsersSchemaInterface {
  accountData: {
    userId: string;
    login: string;
    email: string;
    createdAt: Date;
    hash: string;
    salt: string;
    // passwordAccess: string;
    // passwordRefresh: string;
    // lastActive: string; // new
    // expActive: string; // new
    // ip: string; // new
    // title: string; // new
    // deviceId: string; // new
  };
  banInfo: {
    isBanned: boolean;
    banDate: string;
    banReason: string;
  };
  emailConformation: {
    conformationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };
}
