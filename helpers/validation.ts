import { NextFunction, Request, Response } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { errorWrap, HttpErrors } from './errors';

const validation = (schema: ValidationChain[]) =>
    errorWrap(async (req: Request, _: Response, next: NextFunction) => {
        await Promise.all(schema.map((valid) => valid.run(req)));
        const valRes = validationResult(req);
        if (valRes.isEmpty()) return next();
        const errorMessages = valRes
            .array()
            .map(
                (err) =>
                    `${err.msg} ${err.param} in ${err.location} - ${err.value}`
            )
            .join(', ');

        throw HttpErrors.BadRequest(errorMessages);
    });

export default validation;
