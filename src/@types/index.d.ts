//import {Request,Response,NextFunction} from "@types/express";

declare global {
  namespace Express {
    declare interface Request {
      hash: string;
    }
  }
}

export {};
