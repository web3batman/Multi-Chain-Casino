import { NextFunction, Request, Response } from "express";

import * as localizations from "@/utils/localizations";
import logger from "@/utils/logger";

export const routeNotFound = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(`Route not found: ${req.method} ${req.originalUrl}`);
  return res
    .status(404)
    .json({ message: localizations["en"].ERRORS.OTHER.NOT_FOUND_ENDPOINT });
};

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { message, status } = err;

  logger.error(err);

  switch (err.name) {
    case "UnauthorizedError":
      return res.status(401).json({
        error: localizations["en"].ERRORS.OTHER.UNAUTHORIZED,
      });

    default:
      return res.status(status || 500).json({ message });
  }
};
