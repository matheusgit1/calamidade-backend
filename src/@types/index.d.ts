declare global {
  namespace Express {
    declare interface Request {
      hash: string;
    }
  }
}
