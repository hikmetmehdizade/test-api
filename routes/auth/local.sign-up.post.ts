import { NextFunction, Request, Response, Router } from 'express';
import { errorWrap, HttpErrors } from '../../helpers/errors';
import { User, UserIdentity } from '../../prisma/generated';
import { prisma } from '../../app';
import * as jwt from 'jsonwebtoken';
import { AuthCookies, JWT_SECRET_KEY } from '../../const';
import { generateTokens } from '../../helpers/token';

const router = Router();

interface UserSignUpInput
  extends Pick<User, 'email' | 'firstName' | 'lastName'>,
    Pick<UserIdentity, 'password'> {}

router.post(
  '/auth/local/sign-up',
  errorWrap(
    async (
      req: Request<any, any, UserSignUpInput>,
      res: Response,
      next: NextFunction
    ) => {
      const { email, password, firstName, lastName } = req.body;

      const userCount = await prisma.user.count({ where: { email } });

      if (userCount !== 0) {
        throw HttpErrors.Forbidden('User with email exists');
      }

      const signPassword = await jwt.sign(password, JWT_SECRET_KEY);

      const { accessToken, refreshToken } = generateTokens(email);

      const [user] = await prisma.$transaction([
        prisma.user.create({ data: { email, firstName, lastName } }),
        prisma.userIdentity.create({
          data: { email, password: signPassword, refreshToken },
        }),
      ]);

      res
        .status(200)
        .cookie(AuthCookies.ACCESS_TOKEN, accessToken)
        .cookie(AuthCookies.REFRESH_TOKEN, refreshToken)
        .json({
          user,
        });
      next();
    }
  )
);

export default router;
