import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      // mongoose.connect(process.env.MONGO_DB),
      mongoose.connect(process.env.MONGO_DB5),
  },
];
