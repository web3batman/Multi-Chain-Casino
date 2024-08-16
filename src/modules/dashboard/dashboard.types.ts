import { IUserModel } from "../user/user.interface";

export type TDashboardDocumentType = Pick<
  IUserModel,
  "_id" | "username" | "leaderboard" | "avatar" | "hasVerifiedAccount" | "rank"
>;
