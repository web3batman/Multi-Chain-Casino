import mongoose, { Document } from "mongoose";

import { IUserModel } from "../user/user.interface";

export interface IAutoCrashBetModel extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId | IUserModel;
  betAmount: number;
  denom: string;
  cashoutPoint: number;
  status: boolean;
  count: number;
}
