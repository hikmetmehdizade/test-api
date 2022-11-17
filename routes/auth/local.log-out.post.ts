import { prisma } from '../../app';
import { AuthCookies } from '../../const';
import { NextFunction, Request, Response, Router } from 'express';
import { errorWrap } from '../../helpers/errors';
import { authMiddleware } from '../../middleware/authMiddleware';
const router = Router();

router.post(
  '/auth/local/log-out',
  authMiddleware([]),
  errorWrap(async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;

    await prisma.userIdentity.update({
      where: {
        uuid: user.uuid,
      },
      data: {
        refreshToken: null,
      },
    });

    res
      .status(200)
      .clearCookie(AuthCookies.ACCESS_TOKEN)
      .clearCookie(AuthCookies.REFRESH_TOKEN)
      .json('Success');
    next();
  })
);

export default router;
