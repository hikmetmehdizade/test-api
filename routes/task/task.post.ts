import { errorWrap, HttpErrors } from '../../helpers/errors';
import { body } from 'express-validator';
import validation from '../../helpers/validation';
import { Request, Response, Router } from 'express';
import { Task } from '../../prisma/generated';
import { prisma } from '../../app';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();
router.post(
  '/task',
  authMiddleware([]),
  validation([
    body('title').isString().isLength({ min: 3 }).notEmpty(),
    body('isDone').isBoolean().optional(),
  ]),
  errorWrap(
    async (req: Request<{}, Task, Pick<Task, 'title'>>, res: Response) => {
      const { title } = req.body;
      const { user, workspaceId } = res.locals;

      const statuses = await prisma.workspaceTaskStatus.findMany({
        where: {
          workspaceId,
        },
        orderBy: {
          order: 'asc',
        },
      });

      const member = await prisma.workspaceMember.findFirst({
        where: {
          userId: user.uuid,
          workspaceId,
        },
      });
      if (!member) {
        throw HttpErrors.NotFound('Workspace member not found');
      }
      const task = await prisma.task.create({
        data: {
          title,
          status: {
            connect: {
              uuid: 'sdsadsada',
            },
          },
          workspace: {
            connect: {
              uuid: workspaceId,
            },
          },
          assignedMembers: {
            create: [
              {
                role: 'CREATOR',
                member: {
                  connect: {
                    uuid: member.uuid,
                  },
                },
              },
            ],
          },
        },
      });
      res.status(201).json(task);
    }
  )
);

export default router;
