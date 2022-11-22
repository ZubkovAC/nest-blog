import mongoose from 'mongoose';

export const DevicesAuthSchemas = new mongoose.Schema({
  userId: String,
  deviceId: String,
  ip: String,
  accessPassword: String,
  refreshPassword: String,
  lastActive: String,
  expActive: String,
  title: String,
});

export interface devicesAuthSchemasInterface {
  userId: string;
  deviceId: string;
  ip: string;
  accessPassword: string;
  refreshPassword: string;
  lastActive: string;
  expActive: string;
  title: string;
}
