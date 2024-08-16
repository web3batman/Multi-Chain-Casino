import { NextFunction, Request, Response } from "express";

import { IAuthInfo } from "@/modules/auth/auth.types";
import { ROLE, STATUS } from "@/modules/user/user.constant";
import UserService from "@/modules/user/user.service";
import * as ILocalizations from "@/utils/localizations";

const localizations = ILocalizations["en"];

export default function checkPermissions({
  roles,
  statusArr,
}: {
  roles?: Array<ROLE>;
  statusArr?: Array<STATUS>;
} = {}) {
  return async (
    req: Request & {
      token: { [key: string]: unknown };
      user: IAuthInfo;
    },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const baseRoles = [ROLE.ADMIN, ROLE.MEMBER];
      const baseStatusArr = [
        STATUS.VERIFIED,
        STATUS.WITH_PAYMENT,
        STATUS.WITHOUT_PAYMENT,
      ];
      roles = !roles ? baseRoles : roles;
      statusArr = !statusArr ? baseStatusArr : statusArr;

      const userService = new UserService();
      const user = req.user?.userId
        ? await userService.getItemById(req.user.userId)
        : null;

      // Set user role as member by default
      if (user?.role !== ROLE.ADMIN) {
        user.role = ROLE.MEMBER;
      }

      if (user?.role) {
        if (roles.includes(user?.role as ROLE)) {
          return next();
        } else {
          return res.status(401).json({
            error: localizations.ERRORS.AUTH.USE_NEW_TOKEN,
            oldUser: req.user,
            newUser: {
              userId: user._id,
              role: user.role,
              status: user.status,
            },
          });
        }
      } else {
        return res.status(403).json({
          error: localizations.ERRORS.OTHER.FORBIDDEN,
          oldUser: req.user,
          newUser: user
            ? { userId: user._id, role: user.role, status: user.status }
            : null,
        });
      }
    } catch (error) {
      res.status(error.status || 400).json({ error: error.message });
    }
  };
}
