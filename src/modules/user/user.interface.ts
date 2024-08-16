import mongoose, { Document } from "mongoose";

interface LeaderboardEntry {
  betAmount: number;
  winAmount: number;
}

export interface IUserModel extends Document {
  provider: string;
  role: string;
  status: string;
  providerId: string;
  username: string;
  password: string;
  avatar: string;
  rank: number;
  wallet: Map<string, number>;
  wager: Map<string, Map<string, number>>;
  leaderboard: Map<string, Map<string, LeaderboardEntry>>;
  crypto: any; // Specify more detailed type if possible
  hasVerifiedAccount: boolean;
  verifiedPhoneNumber: string | null;
  accountVerified: Date | null;
  banExpires: string;
  selfExcludes: {
    crash: number;
    coinflip: number;
    mines: number;
  };
  muteExpires: string;
  transactionsLocked: boolean;
  betsLocked: boolean;
  _affiliatedBy: mongoose.Schema.Types.ObjectId | null;
  affiliateClaimed: Date | null;
  affiliateCode: string | null;
  affiliateMoney: Map<string, number>;
  affiliateMoneyCollected: Map<string, number>;
  forgotToken: string | null;
  forgotExpires: number;
  rakebackBalance: Map<string, number>;
  wagerNeededForWithdraw: Map<string, number>;
  totalDeposited: Map<string, number>;
  totalWithdrawn: Map<string, number>;
  customWagerLimit: Map<string, number>;
  avatarLastUpdate: number;
  signAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

export const getId = (req) => {
  if (req.params.id === "me") {
    return req?.user?.userId || "000000000000000000000000";
  }

  return req.params.id;
};
