import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
  Router,
} from 'express';
import cookieParser from 'cookie-parser';

import recursive from 'recursive-readdir';
import { AppError } from './helpers/errors';
import { PrismaClient } from './prisma/generated';

const prisma = new PrismaClient();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/', (_: Request, res: Response) => {
  res.status(200).json('hello');
});

recursive(`${__dirname}/routes`, [], (err, files) => {
  (async (f: string[]) => {
    for (let i = 0; i < f.length; ++i) {
      const route: Router = (await import(f[i])).default;
      app.use('/v1', (req, res, next) => route(req, res, next));
    }
  })(files);
});

app.use(
  (
    err: ErrorRequestHandler<AppError>,
    _: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log(err);
    if (err instanceof AppError) {
      return res.status(err.statusCode).json(err);
    }
    res.status(500).json(err);
    next();
  }
);
export { prisma };
export default app;
