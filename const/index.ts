import { AuthCookies } from './cookies';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY ?? '123';

export { JWT_SECRET_KEY, AuthCookies };
