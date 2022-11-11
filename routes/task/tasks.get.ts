import { Request, Response, Router } from 'express';
import { Task } from '../../prisma/generated';
import { errorWrap } from '../../helpers/errors';
import { prisma } from '../../app';

const router = Router();

router.get(
    '/tasks',
    errorWrap(async (_: Request, res: Response<Task[]>) => {
        const tasks = await prisma.task.findMany();

        res.status(200).json(tasks);
    })
);

export default router;
