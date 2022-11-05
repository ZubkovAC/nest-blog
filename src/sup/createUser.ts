import { add } from 'date-fns';

export const createUser = (
  login: string,
  email: string,
  passwordAccess: string,
  passwordRefresh: string,
  hash: string,
  salt: string,
  userId: string,
  conformationCode: string,
  isConfirmed?: boolean,
) => {
  return {
    accountData: {
      userId: userId,
      login: login,
      email: email,
      createAt: new Date(),
      passwordAccess: passwordAccess,
      passwordRefresh: passwordRefresh,
      hash: hash,
      salt: salt,
    },
    emailConformation: {
      conformationCode: conformationCode,
      expirationDate: add(new Date(), { minutes: 5 }),
      isConfirmed: isConfirmed ? isConfirmed : false,
    },
  };
};
