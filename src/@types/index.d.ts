import type { Request } from 'express';

declare global {
  namespace Express {
    declare interface Request {
      hash: string;
    }
  }
}
