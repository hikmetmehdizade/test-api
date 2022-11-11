declare global {
  namespace Express {
    interface Response {
      locals: string;
    }
  }
}

