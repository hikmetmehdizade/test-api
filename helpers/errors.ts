import { ExpressType } from '../types/express';

type ErrorWrapType = (func: any) => ExpressType;

const errorWrap: ErrorWrapType = (func) => async (req, res, next) =>  func(req, res, next).catch(next);


interface ErrorProps {
    message: string;
    statusCode: number
}

class AppError extends Error {
    statusCode: number;
    constructor({ message, statusCode }: ErrorProps) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

const HttpErrors = {
    BadRequest: (message = 'Bad Request') =>
        new AppError({ message, statusCode: 403 }),
    NotFound: (message = 'Not Found') =>
        new AppError({ message, statusCode: 404 }),
};

export { errorWrap, AppError, HttpErrors };
