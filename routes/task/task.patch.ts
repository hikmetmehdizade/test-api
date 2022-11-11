import { Request, Response, Router } from 'express';

import { errorWrap } from '../../helpers/errors';
import { body, param } from 'express-validator';
import validation from '../../helpers/validation';
import { Task } from '../../prisma/generated';
import { prisma } from '../../app';

const router = Router();

router.patch(
  '/task/:uuid',
  validation([
    param('uuid').isUUID(4).notEmpty(),
    body('isDone').isBoolean().optional(),
    body('title').isString().isLength({ min: 3 }).optional(),
  ]),
  errorWrap(
    async (
      req: Request<{ uuid: string }, Task, { isDone: boolean; title: string }>,
      res: Response<Task>
    ) => {
      const { uuid } = req.params;

      const task = await prisma.task.update({
        where: { uuid },
        data: { ...req.body },
      });

      res.status(200).json(task);
    }
  )
);

export default router;
