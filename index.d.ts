declare global {
  namespace Express {
    interface Response {
      locals: {
        user: import('./prisma/generated').User;
        workspaceId: string;
      };
    }
  }
}
