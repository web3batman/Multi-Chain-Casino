import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongoose";

import { PLATFORM } from "@/modules/auth/auth.constant";
import { IAuthInfo } from "@/modules/auth/auth.types";
import { ROLE, STATUS } from "@/modules/user/user.constant";
import * as localizations from "@/utils/localizations";

export default async (
  req: Request & { token: { [key: string]: unknown }; user: IAuthInfo },
  res: Response,
  next: NextFunction
) => {
  if (req.token) {
    req.user = {
      userId: req.token.userId as ObjectId,
      role: req.token.role as ROLE,
      status: req.token.status as STATUS,
      deviceId: req.token.deviceId as string,
      platform: req.token.platform as PLATFORM,
    };

    if (!req.user) {
      return res.status(401).json({
        error: localizations["en"].ERRORS.OTHER.UNAUTHORIZED,
      });
    }

    return next();
  } else {
    return next();
  }
};
