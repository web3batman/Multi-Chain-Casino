import { StdSignature } from "@keplr-wallet/types";

export type TransactionDetails = {
  sender: string;
  receiver: string;
  amount: string;
  denom: string;
};


export type TWithDrawProps = {
  amount: number;
  tokenType: ETokenType;
  address: string;
};

export type TCheckDepositParam = {
  amount: number;
  tokenType: ETokenType;
  address: string;
  txHash: string;
};

export type TUpdateBalance = {
  balanceType: ETokenType;
  amount: number;
  txHash?: string;
  address: string;
};

export type TSocketDepositParam = {
  amount: number;
  currency: string;
  address: string;
  txHash: string;
  signedTx: StdSignature;
};

export type TSocketWithDrawParam = {
  amount: number;
  currency: string;
  address: string;
  txHash: string;
  signedTx: StdSignature;
};
