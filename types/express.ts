import { Request, Response, NextFunction } from 'express';

export type ExpressType = (
    req: Request,
    res: Response,
    next: NextFunction
) => void;
