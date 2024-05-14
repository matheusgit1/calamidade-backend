declare global {
  export interface RequestUserInfo {
    noUsuario: string;
    coUsuario: number;
  }
  namespace Express {
    declare interface Request {
      hash: string;
      user: RequestUserInfo;
    }
  }
}
