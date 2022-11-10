import express, {
    ErrorRequestHandler,
    Request,
    Response,
    NextFunction,
} from 'express';

import recursive from 'recursive-readdir';
import { AppError } from './helpers/errors';

const app = express();

app.use(express.json());

app.get('/', (_: Request, res: Response) => {
    res.status(200).json('hello');
});

recursive(`${__dirname}/routes`, [], (err, file) => {
    file.forEach((item) => {
        app.use('/', (...args) => require(item)(...args));
    });
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

export default app;
