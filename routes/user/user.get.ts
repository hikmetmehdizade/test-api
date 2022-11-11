import { NextFunction, Request, Response, Router } from 'express';
import { errorWrap } from '../../helpers/errors';

const router = Router();

router.get(
  '/me',
  errorWrap(async (req: Request, res: Response, next: NextFunction) => {})
);

export default router;
