import * as mongoose from 'mongoose';

export const UsersSchema = new mongoose.Schema({
  accountData: {
    userId: String,
    login: String,
    email: String,
    createdAt: Date,
    hash: String,
    salt: String,
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
