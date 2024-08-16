import { IUserModel } from "./user.interface";

export interface IVIPLevelType {
  name: string;
  wagerNeeded?: number;
  rakebackPercentage?: number;
  levelName?: string;
  levelColor?: string;
}

export type TChatUser = Pick<
  IUserModel,
  "_id" | "username" | "avatar" | "hasVerifiedAccount" | "createdAt"
>;

export type TLeaderboardUserType = Pick<
  IUserModel,
  "_id" | "username" | "leaderboard" | "avatar" | "hasVerifiedAccount" | "rank"
>;
