import { Request, Response, Router } from 'express';
import { errorWrap } from '../../helpers/errors';
import { User, UserIdentity } from '../../prisma/generated';
import { prisma } from '../../app';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../../const';
import { generateTokens } from '../../helpers/token';

const router = Router();

interface UserSignUpInput
  extends Pick<User, 'email' | 'firstName' | 'lastName'>,
    Pick<UserIdentity, 'password'> {}

router.post(
  '/auth/local/sign-up',
  errorWrap(async (req: Request<any, any, UserSignUpInput>, res: Response) => {

    const { email, password, firstName, lastName } = req.body;

    const signPassword = await jwt.sign(password, JWT_SECRET_KEY);

    const { accessToken, refreshToken } = generateTokens(email);

    const [user] = await Promise.all([
      prisma.user.create({ data: { email, firstName, lastName } }),
      prisma.userIdentity.create({
        data: { email, password: signPassword, refreshToken },
      }),
    ]);

   return  res.status(201).json({
      user,
      accessToken,
      refreshToken,
    });
  })
);

export default router;
