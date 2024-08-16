import { Request } from "express";

import { PLATFORM } from "@/modules/auth/auth.constant";
import { IAuthInfo } from "@/modules/auth/auth.types";

import detectMobFromUserAgent from "../helpers/detect-mobFromUserAgent";

export const deviceInfo = ({
  headers: { deviceid, platform },
}): { deviceId: string; platform: PLATFORM } => ({
  deviceId: deviceid,
  platform,
});

export const getIdFromParams = (req: Request): string => req.params.id;
export const getQuery = ({ query }: Request) => query;

export const isMobile = (req: Request) => {
  return detectMobFromUserAgent(req.get("User-Agent"));
};

export const getBody = (req: Request) => {
  return req.body;
};

interface RequestWithuser extends Request {
  user: IAuthInfo;
}

export const getUserInfo = ({ user }: RequestWithuser): IAuthInfo =>
  user as IAuthInfo;

export const getNameFromParam = (req: Request) => {
  return req.params.name;
};

export const getUTCFromHeader = (req: Request): number =>
  req.headers["x-timezone"] ? Number(req.headers["x-timezone"]) : 0;
