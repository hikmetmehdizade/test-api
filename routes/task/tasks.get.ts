import { Request, Response, Router } from 'express';
import { Task } from '../../prisma/generated';
import { errorWrap } from '../../helpers/errors';
import { prisma } from '../../app';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

router.get(
  '/tasks',
  authMiddleware([]),
  errorWrap(async (req: Request, res: Response) => {
    const { uuid } = res.locals.user;

    const tasks = await prisma.task.findMany();

    res.status(200).json(tasks);
  })
);

export default router;
