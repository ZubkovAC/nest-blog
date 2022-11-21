import * as jwt from 'jsonwebtoken';

export const createJWT = async (dateUser: dateUserJwtType, expired: string) => {
  return jwt.sign(dateUser, process.env.SECRET_KEY, { expiresIn: expired });
};
export type dateUserJwtType = {
  userId: string;
  login: string;
  email: string;
};

export const dateExpired = {
  '0': '0sec',
  '1': '1sec',
  '10s': '10sec',
  '15s': '15sec',
  '20s': '20sec',
  '1h': '1h',
  '2h': '2h',
  '24h': '24h',
  '48h': '48h',
};
