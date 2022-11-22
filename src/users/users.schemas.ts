import * as mongoose from 'mongoose';

export const UsersSchema = new mongoose.Schema({
  accountData: {
    userId: String,
    login: String,
    email: String,
    createdAt: Date,
    // passwordAccess: String,
    // passwordRefresh: String,
    hash: String,
    salt: String,
    // lastActive: String, // new
    // expActive: String, // new
    // ip: String, // new
    // title: String, // new
    // deviceId: String, // new
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
    // passwordAccess: string;
    // passwordRefresh: string;
    hash: string;
    salt: string;
    // lastActive: string; // new
    // expActive: string; // new
    // ip: string; // new
    // title: string; // new
    // deviceId: string; // new
  };
  emailConformation: {
    conformationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };
}
