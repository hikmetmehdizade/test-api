import { NextFunction, Request, Response, Router } from 'express';
import { generateTokens, verifyPassword } from '../../helpers/token';
import { errorWrap, HttpErrors } from '../../helpers/errors';
import { prisma } from '../../app';
import { AuthCookies } from '../../const';

const router = Router();

router.post(
  '/auth/local/sign-in',
  errorWrap(
    async (
      req: Request<any, any, { email: string; password: string }>,
      res: Response,
      next: NextFunction
    ) => {
      const { email, password } = req.body;

      const userIdentity = await prisma.userIdentity.findUnique({
        where: { email },
      });

      if (!userIdentity) {
        throw HttpErrors.NotFound(`User with ${email} not found`);
      }

      if (!verifyPassword(password, userIdentity.password)) {
        throw HttpErrors.BadRequest('Wrong password');
      }

      const { accessToken, refreshToken } = generateTokens(userIdentity.email);
      const [user] = await Promise.all([
        prisma.user.findUnique({ where: { email } }),
        prisma.userIdentity.update({
          data: { refreshToken },
          where: { email },
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
