import 'dotenv/config';

export const canSendEmailOrSms = (): boolean => {
  return (
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'development'
  );
};
