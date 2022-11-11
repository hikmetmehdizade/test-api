import { errorWrap } from '../../helpers/errors';
import { body } from 'express-validator';
import validation from '../../helpers/validation';
import { Request, Response, Router } from 'express';
import { Task } from '../../prisma/generated';
import { prisma } from '../../app';

const router = Router();
router.post(
    '/task',
    validation([
        body('title').isString().isLength({ min: 3 }).notEmpty(),
        body('isDone').isBoolean().optional(),
    ]),
    errorWrap(
        async (
            req: Request<{}, Task, Pick<Task, 'isDone' | 'title'>>,
            res: Response
        ) => {
            const { title, isDone } = req.body;
            const { email } = res.locals;

            const task = await prisma.task.create({
                data: { title, isDone, createdBy: { connect: { email } } },
            });
            res.status(201).json(task);
        }
    )
);

export default router;
