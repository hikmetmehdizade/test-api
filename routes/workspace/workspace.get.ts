import { prisma } from '../../app';
import { Request, Response, Router } from 'express';
import { errorWrap, HttpErrors } from '../../helpers/errors';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

router.get(
  '/workspace/:workspaceId',
  authMiddleware([]),
  errorWrap(async (req: Request<{ workspaceId: string }>, res: Response) => {
    const { workspaceId } = req.params;
    const { user } = res.locals;

    const workspace = await prisma.workspace.findFirst({
      where: {
        uuid: workspaceId,
        members: {
          some: {
            user: {
              uuid: user.uuid,
            },
          },
        },
      },
    });

    if (!workspace) {
      throw HttpErrors.NotFound('Workspace not fo und');
    }

    res.status(200).json({
      workspace,
    });
  })
);

export default router;
