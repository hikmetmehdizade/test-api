import { NextFunction, Request, Response, Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import { errorWrap } from '../../helpers/errors';

const router = Router();

router.get(
  '/me',
  authMiddleware,
  errorWrap(async (_: Request, res: Response) => {
    const { user } = res.locals;
    res.status(200).json({ user });
  })
);

export default router;
