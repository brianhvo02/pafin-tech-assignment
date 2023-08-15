import 'dotenv/config';

export const PORT = process.env.PORT || 3000;

export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isTesting = process.env.NODE_ENV === 'test';

if (!process.env.JWT_KEY)
    throw new Error('No JWT key given');

export const secretOrKey = Buffer.from(process.env.JWT_KEY, 'hex');