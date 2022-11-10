const router = require('express').Router();
import { Request, Response } from 'express';
import { param } from 'express-validator';
import { errorWrap, HttpErrors } from '../../helpers/errors';
import validation from '../../helpers/validation';
import { prisma } from '../../server';

router.delete(
    '/task/:uuid',
    validation([param('uuid').isUUID(4)]),
    errorWrap(async (req: Request<{ uuid: string }>, res: Response) => {
        const { uuid } = req.params;
        const task = await prisma.task.findUnique({ where: { uuid } });
        if (!task) {
            throw HttpErrors.NotFound('Task not found');
        }

        await prisma.task.delete({ where: { uuid } });

        res.sendStatus(204);
    })
);

module.exports = router;
