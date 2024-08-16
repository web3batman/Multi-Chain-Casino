import { IStakingModel } from "./staking.interface";

export type TStaking = Pick<
  IStakingModel,
  "_id" | "address" | "txDate" | "amount" | "txType"
>;
