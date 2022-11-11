import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../const';

interface TokenPayload extends JwtPayload {
  email: string;
  workspaceId?: string;
}

const generateTokens = (email: string, workspaceId?: string) => {
  const accessToken = jwt.sign({ email, workspaceId }, JWT_SECRET_KEY, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ email, workspaceId }, JWT_SECRET_KEY, {
    expiresIn: '30 days',
  });

  return {
    accessToken,
    refreshToken,
  };
};

const verifyToken = (token?: string): TokenPayload | undefined => {
  if (typeof token !== 'undefined') {
    try {
      const verifiedToken = jwt.verify(token, JWT_SECRET_KEY, {
        complete: false,
      });
      if (typeof verifiedToken !== 'string') {
        const email = verifiedToken.email as string;
        return { ...verifiedToken, email };
      }
    } catch (err) {
      console.error('TokenError:', err);
    }
  }
};

const verifyPassword = (password: string, hashedPassword: string): boolean => {
  const p = jwt.verify(hashedPassword, JWT_SECRET_KEY);
  return password === p;
};

export { generateTokens, verifyPassword, verifyToken };
