import { Request, Response, Router } from 'express';
import { errorWrap } from '../../helpers/errors';
import { authMiddleware } from '../../middleware/authMiddleware';
import { prisma } from '../../app';
const router = Router();

router.get(
  '/workspaces',
  authMiddleware([]),
  errorWrap(async (req: Request, res: Response) => {
    const { user } = res.locals;

    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId: user.uuid,
          },
        },
      },
    });

    res.status(200).json({ workspaces });
  })
);

export default router;
