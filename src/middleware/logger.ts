import { NextFunction, Request, Response } from "express";

import logger from "@/utils/logger";

export default (req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
};
