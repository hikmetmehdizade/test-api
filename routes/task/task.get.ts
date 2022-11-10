import { param } from 'express-validator';
import { errorWrap, HttpErrors } from '../../helpers/errors';
import validation from '../../helpers/validation';
const router = require('express').Router();
import { prisma } from '../../server';
import { Request, Response } from 'express';

router.get(
    '/task/:uuid',
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

module.exports = router;
