import mongoose, { Document } from "mongoose";

export interface IUserBotModel extends Document {
  provider: string;
  providerId: string;
  username: string;
  password: string;
  avatar: string;
  rank: number;
  wallet: number;
  wager: number;
  crypto: any; // Specify more detailed type if possible
  hasVerifiedAccount: boolean;
  verifiedPhoneNumber: string | null;
  accountVerified: Date | null;
  banExpires: string;
  selfExcludes: {
    crash: number;
    coinflip: number;
  };
  muteExpires: string;
  transactionsLocked: boolean;
  betsLocked: boolean;
  _affiliatedBy: mongoose.Schema.Types.ObjectId | null;
  affiliateClaimed: Date | null;
  affiliateCode: string | null;
  affiliateMoney: number;
  affiliateMoneyCollected: number;
  forgotToken: string | null;
  forgotExpires: number;
  rakebackBalance: number;
  wagerNeededForWithdraw: number;
  totalDeposited: number;
  totalWithdrawn: number;
  customWagerLimit: number;
  avatarLastUpdate: number;
}
