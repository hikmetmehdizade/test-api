import { param } from 'express-validator';
import { errorWrap, HttpErrors } from '../../helpers/errors';
import validation from '../../helpers/validation';
import { prisma } from '../../app';
import { Request, Response, Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();
router.get(
  '/task/:uuid',
  authMiddleware([]),
  validation([param('uuid').isUUID(4)]),
  errorWrap(async (req: Request<{ uuid: string }>, res: Response) => {
    const { uuid } = req.params;

    const task = await prisma.task.findFirst({ where: { uuid } });

    if (!task) {
      throw HttpErrors.NotFound('Task not found');
    }

    res.status(200).json(task);
  })
);

export default router;
