import { Types } from "mongoose";

import { IChatEmitHistory } from "@/modules/chat-history";
import {
  IBetType,
  ICrashGameModel,
  IFormattedGameHistoryType,
  IPendingBetType,
  TFormattedPlayerBetType,
} from "@/modules/crash-game";
import { TChatUser, TLeaderboardUserType } from "@/modules/user/user.types";

export interface IClientToServerEvents {
  hello: () => void;

  // //conflipgame Events
  // "game-creation-error": (message: string) => void;
  // "new-coinflip-game": (gameData: any) => void;
  // "coinflipgame-join-success": () => void;
  // "coinflipgame-joined": (data: {
  //   _id: string;
  //   newPlayer: ICoinPlayer;
  // }) => void;
  // "coinflipgame-rolling": (data: {
  //   game_id: string;
  //   animation_time: number;
  // }) => void;
  // "coinflipgame-rolled": ({
  //   _id,
  //   randomModule,
  //   coinflipResult,
  //   isEarn,
  // }: {
  //   _id: string;
  //   randomModule: number;
  //   coinflipResult: boolean[];
  //   isEarn: boolean;
  // }) => void;
  // "game-called-bot": (data: { _id: string; playerId: string }) => void;

  // //minesgame events
  // "created-mines-game": (data: number[]) => void;
  // "minesgame-rolled": (data: boolean) => void;
  // "minesgame-ended": (data: {
  //   winAmount: number | null;
  //   mines: number[];
  // }) => void;

  //chat
  message: (data: {
    _id: Types.ObjectId;
    user: TChatUser;
    message: string;
    sentAt: Date;
  }) => void;
  "send-chat-history": (data: {
    message: string;
    chatHistories: IChatEmitHistory[];
  }) => void;

  //leaderboard
  "leaderboard-fetch-all": (data: {
    message: string;
    leaderboard: { [key: string]: TLeaderboardUserType[] };
  }) => void;
  // 'leaderboard-bet-update': (data: { game: string; updateData: PendingBetType[] }) => void;
  // 'leaderboard-win-update': (data: { game: string; updateData: BetType }) => void;

  //dashboard
  "dashboard-fetch-all": (data: {
    message: string;
    dashboard: { [key: string]: TLeaderboardUserType[] };
  }) => void;

  "dashboard-pnl": (data: {
    message: string;
    pnl: { [key: string]: number };
  }) => void;
}

export interface ISocketData {
  lastAccess?: number;
  markedForDisconnect?: boolean;
}
