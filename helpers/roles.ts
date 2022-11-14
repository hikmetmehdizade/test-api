import { prisma } from '../app';
import { WorkspaceMemberRole } from '../prisma/generated';
import { HttpErrors } from './errors';

const ensureWorkspaceMemberRole = async (
  roles: WorkspaceMemberRole[],
  email: string,
  workspaceId?: string
) => {
  if (workspaceId) {
    const workspace = await prisma.workspace.count({
      where: {
        uuid: workspaceId,
        members: {
          some: {
            user: {
              email,
            },
            role: {
              in: roles,
            },
          },
        },
      },
    });
    if (workspace === 0) {
      throw HttpErrors.Forbidden('Not enough rights');
    }
  } else {
    throw HttpErrors.BadRequest('Workspace not found');
  }
};

export { ensureWorkspaceMemberRole };
