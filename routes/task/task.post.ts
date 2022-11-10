const router = require('express').Router();
import { errorWrap } from '../../helpers/errors';
import { body } from 'express-validator';
import validation from '../../helpers/validation';
import { Request, Response } from 'express';
import { Task } from 'prisma/generated';
import { prisma } from '../../server';

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

            const task = await prisma.task.create({ data: { title, isDone } });
            res.status(201).json(task);
        }
    )
);

module.exports = router;
