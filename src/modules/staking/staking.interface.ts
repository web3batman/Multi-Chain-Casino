import { Document } from "mongoose";

import { ETXTYPE } from "./staking.constant";

export interface IStakingModel extends Document {
  address: string;
  txDate: Date;
  amount: number;
  txAmount: number;
  txStatus: string;
  txHash: string;
  txType: ETXTYPE;
  createdAt: Date;
  updatedAt: Date;
}

export const getId = (req) => {
  if (req.params.id === "me") {
    return req?.user?.userId || "000000000000000000000000";
  }

  return req.params.id;
};
