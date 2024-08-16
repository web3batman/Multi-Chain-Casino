import { NextFunction, Request, Response } from "express";

export default (dir_for_files: string) => {
  return (
    req: Request & { dir_for_files: string },
    _res: Response,
    next: NextFunction
  ) => {
    req.dir_for_files = dir_for_files;
    next();
  };
};
