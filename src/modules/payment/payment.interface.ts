import { Tendermint37Client } from "@cosmjs/tendermint-rpc";
import { kujiraQueryClient } from "kujira.js/lib/cjs/queryClient.js";
import { Document } from "mongoose";

export interface IPaymentModel extends Document {
  userId?: string;
  walletAddress?: string;
  type: string;
  amount: number;
  denom?: string;
  txHash: string;
}

export interface IClient {
  tmClient: Tendermint37Client;
  querier: ReturnType<typeof kujiraQueryClient>;
}
