import mongoose from "mongoose";

import { IVIPLevelType } from "../user/user.types";

export interface IGameStateType {
  _id: mongoose.Types.ObjectId | null;
  status: number;
  crashPoint: number | null;
  startedAt: Date | null;
  duration: number | null;
  players: { [key: string]: IBetType };
  bots: { [key: string]: IBetType };
  pending: { [key: string]: IPendingBetType };
  botCount: number;
  pendingCount: number;
  pendingBets: IPendingBetType[];
  privateSeed: string | null;
  privateHash: string | null;
  publicSeed: string | null;
  connectedUsers: { [key: string]: string };
}

export interface IBetType {
  playerID: string;
  username: string;
  avatar?: string;
  betAmount: number;
  denom: string;
  status: number;
  level: IVIPLevelType;
  stoppedAt?: number;
  autoCashOut: number;
  winningAmount?: number;
  forcedCashout?: boolean;
  autobet?: boolean;
}

export interface IPendingBetType {
  betAmount: number;
  denom: string;
  autoCashOut?: number;
  username: string;
}

export type TFormattedPlayerBetType = Pick<
  IBetType,
  | "playerID"
  | "username"
  | "avatar"
  | "betAmount"
  | "denom"
  | "status"
  | "level"
  | "stoppedAt"
  | "winningAmount"
  | "autobet"
>;

export interface IFormattedGameHistoryType
  extends Pick<
    IGameStateType,
    "_id" | "privateHash" | "privateSeed" | "publicSeed" | "crashPoint"
  > {}
