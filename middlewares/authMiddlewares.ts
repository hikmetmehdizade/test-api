import { Request, Response } from 'express';
import { errorWrap } from 'helpers/errors';

const authMiddleware = errorWrap(async (res: Response, req: Request) => {});
