/**
 * Returns true if app is in production or false if in development.
 */
export const __prod__: boolean = process.env.NODE_ENV === 'production';

/**
 * Returns the cookie name used for user authentication
 */
export const COOKIE_NAME: string = 'qid';

export const APP_URL: string = __prod__
  ? 'https://gardeniox.vercel.app/'
  : 'http://localhost:3000';
