import { Document } from "mongoose";

export declare interface IDashboardModel extends Document {
  revenueType: number;
  denom: string;
  lastBalance: number;
  insertDate?: Date;
}
