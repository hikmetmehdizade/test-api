import { Request, Response } from 'express';
import { Task } from 'prisma/generated';
import { errorWrap } from '../../helpers/errors';
import { prisma } from '../../server';


const router = require('express').Router();

router.get(
    '/tasks',
    errorWrap(async (_: Request, res: Response<Task[]>) => {
        const tasks = await prisma.task.findMany();

        res.status(200).json(tasks);
    })
);

module.exports = router;
