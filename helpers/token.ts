import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../const';

const generateTokens = (email: string) => {
  const accessToken = jwt.sign({ email }, JWT_SECRET_KEY, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ email }, JWT_SECRET_KEY, {
    expiresIn: '30 days',
  });

  return {
    accessToken,
    refreshToken,
  };
};

const verifyPassword = (password: string, hashedPassword: string): boolean => {
  const p = jwt.verify(hashedPassword, JWT_SECRET_KEY);
  return password === p;
};

export { generateTokens, verifyPassword };
