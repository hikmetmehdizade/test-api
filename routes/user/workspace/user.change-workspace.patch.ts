import { authMiddleware } from '../../../middleware/authMiddleware';
import { errorWrap, HttpErrors } from '../../../helpers/errors';
import { Request, Response, Router } from 'express';
import { generateTokens } from '../../../helpers/token';
import { prisma } from '../../../app';
import { AuthCookies } from '../../../const';

const router = Router();

router.patch(
  '/user/workspace/:workspaceId',
  authMiddleware([]),
  errorWrap(async (req: Request<{ workspaceId: string }>, res: Response) => {
    const { workspaceId } = req.params;
    const { user } = res.locals.user;
    const count = await prisma.workspace.count({
      where: {
        uuid: workspaceId,
        members: {
          some: {
            user: {
              email: user.email,
            },
          },
        },
      },
    });

    if (count === 0) {
      throw HttpErrors.Forbidden('User is not a workspace member');
    }

    const { accessToken, refreshToken } = generateTokens(
      user.email,
      workspaceId
    );

    await prisma.$transaction([
      prisma.userIdentity.update({
        data: {
          refreshToken,
        },
        where: {
          email: user.email,
        },
      }),
      prisma.user.update({
        data: {
          currentWorkspace: {
            connect: {
              uuid: workspaceId,
            },
          },
        },
        where: {
          uuid: user.uuid,
        },
      }),
    ]);

    res
      .status(200)
      .cookie(AuthCookies.ACCESS_TOKEN, accessToken)
      .cookie(AuthCookies.REFRESH_TOKEN, refreshToken)
      .json({ workspaceId });
  })
);

export default router;
