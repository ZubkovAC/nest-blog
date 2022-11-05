import * as mongoose from 'mongoose';

export const UsersSchema = new mongoose.Schema({
  accountData: {
    userId: String,
    login: String,
    email: String,
    createAt: Date,
    passwordAccess: String,
    passwordRefresh: String,
    hash: String,
    salt: String,
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
    createAt: Date;
    passwordAccess: string;
    passwordRefresh: string;
    hash: string;
    salt: string;
  };
  emailConformation: {
    conformationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };
}
