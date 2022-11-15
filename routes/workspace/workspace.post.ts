import { authMiddleware } from '../../middleware/authMiddleware';
import { Router, Request, Response } from 'express';
import { errorWrap } from '../../helpers/errors';
import { prisma } from '../../app';

const router = Router();

router.post(
  '/workspace',
  authMiddleware([]),
  errorWrap(async (req: Request, res: Response) => {
    const { user } = res.locals;
    const { name } = req.body;

    const workspace = await prisma.workspace.create({
      data: {
        name,
        members: {
          create: {
            role: 'OWNER',
            user: {
              connect: {
                uuid: user.uuid,
              },
            },
          },
        },
        taskStatuses: {
          create: {
            title: 'Backlog',
          },
        },
      },
    });

    res.status(201).json(workspace);
  })
);

export default router;
