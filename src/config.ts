import 'dotenv/config';

export const PORT = process.env.PORT || 3000;
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isTesting = process.env.NODE_ENV === 'test';