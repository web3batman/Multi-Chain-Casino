import { Document } from "mongoose";

export interface ICrashGameModel extends Document {
  crashPoint?: number; // Optional as per schema
  players: Record<string, any>; // Required as per schema
  refundedPlayers?: any[]; // Optional as per schema
  privateSeed?: string; // Optional as per schema
  privateHash?: string; // Optional as per schema
  publicSeed?: string; // Optional as per schema, with default null
  status: number; // Required as per schema
  userCounts: number; // Required as per schema
  startedAt?: Date; // Optional as per schema
}

export type TAutoCrashBetPayload = {
  betAmount: number;
  cashoutPoint: number;
  count: number;
  denom: string;
};
export interface VIPLevelType {
  name: string;
  wagerNeeded?: number;
  rakebackPercentage?: number;
  levelName?: string;
  levelColor?: string;
}

export interface BetType {
  playerID: string;
  username: string;
  avatar?: string;
  betAmount: number;
  denom: string;
  status: number;
  level: VIPLevelType;
  stoppedAt?: number;
  autoCashOut: number;
  winningAmount?: number;
  forcedCashout?: boolean;
}

export interface IUpdateParams {
  $set: {
    [key: string]: BetType;
  };
}

export type TJoinGamePayload = {
  target: number;
  betAmount: number;
  denom: string;
};
