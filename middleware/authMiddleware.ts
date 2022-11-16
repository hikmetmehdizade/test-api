import { NextFunction, Request, Response } from 'express';
import { errorWrap, HttpErrors } from '../helpers/errors';
import { AuthCookies } from '../const';
import { generateTokens, verifyToken } from '../helpers/token';
import { prisma } from '../app';
import { WorkspaceMemberRole } from '../prisma/generated';
import { ensureWorkspaceMemberRole } from '../helpers/roles';

type AuthTokensType = string | undefined;

export const authMiddleware = (roles: WorkspaceMemberRole[]) =>
  errorWrap(async (req: Request, res: Response, next: NextFunction) => {
    const cookieAccessToken: AuthTokensType =
      req.cookies[AuthCookies.ACCESS_TOKEN];
    const cookieRefreshToken: AuthTokensType =
      req.cookies[AuthCookies.REFRESH_TOKEN];
    const verifiedAccess = verifyToken(cookieAccessToken);
    const verifiedRefresh = verifyToken(cookieRefreshToken);

    if (typeof verifiedAccess !== 'undefined') {
      const user = await prisma.user.findUniqueOrThrow({
        where: { email: verifiedAccess.email },
        include: {
          currentWorkspace: true,
        },
      });

      if (roles.length > 0) {
        await ensureWorkspaceMemberRole(
          roles,
          user.uuid,
          verifiedAccess.workspaceId
        );
      }
      res.locals.workspaceId = user.currentWorkspace?.uuid;
      res.locals.user = user;
      next();
      return;
    }

    if (typeof verifiedRefresh !== 'undefined') {
      const user = await prisma.user.findUniqueOrThrow({
        where: { email: verifiedRefresh.email },
        include: {
          currentWorkspace: true,
        },
      });

      if (roles.length > 0) {
        await ensureWorkspaceMemberRole(
          roles,
          user.uuid,
          verifiedRefresh.workspaceId
        );
      }

      const { accessToken, refreshToken } = generateTokens(
        user.email,
        user.currentWorkspace?.uuid
      );
      await prisma.userIdentity.update({
        data: { refreshToken },
        where: { email: verifiedRefresh.email },
      });

      res.locals.user = user;
      res.locals.workspaceId = user.currentWorkspace?.uuid;
      res
        .cookie(AuthCookies.ACCESS_TOKEN, accessToken)
        .cookie(AuthCookies.REFRESH_TOKEN, refreshToken);
      next();
      return;
    } else {
      res
        .clearCookie(AuthCookies.ACCESS_TOKEN)
        .clearCookie(AuthCookies.REFRESH_TOKEN);
      throw HttpErrors.Unauthorized();
    }
  });
