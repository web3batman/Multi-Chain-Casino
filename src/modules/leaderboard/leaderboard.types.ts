import { IUserModel } from "../user/user.interface";

export type TLeaderboardDocumentType = Pick<
  IUserModel,
  "_id" | "username" | "leaderboard" | "avatar" | "hasVerifiedAccount" | "rank"
>;
