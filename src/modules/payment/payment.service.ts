import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import {
  assertIsDeliverTxSuccess,
  GasPrice,
  SigningStargateClient,
} from "@cosmjs/stargate";
import { HttpBatchClient, Tendermint37Client } from "@cosmjs/tendermint-rpc";

import {
  ADMIN_WALLET_ADDRESS,
  ADMIN_WALLET_MNEMONIC,
  IS_MAINNET,
} from "@/config";
import { CDENOM_TOKENS } from "@/constant/crypto";
import BaseService from "@/utils/base/service";
import { Payment } from "@/utils/db";
import logger from "@/utils/logger";

import {
  CAllowTimeDiff,
  fromHumanString,
  IClient,
  IPaymentModel,
  TCheckDepositParam,
  TransactionDetails,
  TWithDrawProps,
} from ".";

export class PaymentService extends BaseService<IPaymentModel> {
  private instance: IClient | null = null;
  public rpcClient = new HttpBatchClient(, {
    dispatchInterval: 2000,
  });

  constructor() {
    super(Payment);
  }

  public createClient = async (): Promise<IClient> => {
    const tmClient = await Tendermint37Client.create(this.rpcClient);
    return { tmClient, querier };
  };

  public getClient = async (): Promise<IClient> => {
    if (!this.instance) {
      this.instance = await this.createClient();
    }

    return this.instance;
  };

  public getTransactionDetails = (
    txDetailsString: string
  ): TransactionDetails | null => {
    try {
      const txDetailsArray = JSON.parse(txDetailsString);

      let sender = "";
      let receiver = "";
      let amount = "";
      let denom = "";

      txDetailsArray.forEach((tx: any) => {
        tx.events.forEach((event: any) => {
          if (event.type === "message") {
            event.attributes.forEach((attr: any) => {
              if (attr.key === "sender") {
                sender = attr.value;
              }
            });
          }

          if (event.type === "transfer") {
            event.attributes.forEach((attr: any) => {
              if (attr.key === "recipient") {
                receiver = attr.value;
              }

              if (attr.key === "amount") {
                const amountDenom = attr.value.match(/^(\d+)(.*)$/);

                if (amountDenom) {
                  amount = amountDenom[1];
                  denom = amountDenom[2];
                }
              }
            });
          }
        });
      });

      if (sender && receiver && amount && denom) {
        return { sender, receiver, amount, denom };
      } else {
        console.error("Failed to extract all transaction details.");
        return null;
      }
    } catch (error) {
      console.error("Error parsing transaction details:", error);
      return null;
    }
  };

  public checkDepositPayment = async (payload: TCheckDepositParam) => {
    try {
      console.log({ txDetails })
      const txTime = new Date(txDetails.txResponse.timestamp);
      const timeDiff = new Date().getTime() - txTime.getTime();

      if (timeDiff > CAllowTimeDiff) {
        return false;
      }

      if (txDetails.txResponse?.rawLog) {
        const txLowLogs: string = txDetails.txResponse?.rawLog;
        const checkDetails = this.getTransactionDetails(txLowLogs);

        if (
          checkDetails?.amount !==
          fromHumanString(payload.amount.toString(), 6).toString()
        ) {
          return false;
        }

        if (checkDetails?.sender !== payload.address) {
          return false;
        }

        if (checkDetails?.receiver !== ADMIN_WALLET_ADDRESS) {
          return false;
        }

        if (checkDetails?.denom !== CDENOM_TOKENS[payload.tokenType]) {
          return false;
        }
      } else {
        return false;
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  public withDrawToUser = async (payload: TWithDrawProps) => {
    try {
      

      const [account] = await signer.getAccounts();
      const msgs = [
        msg.bank.msgSend({
          fromAddress: ADMIN_WALLET_ADDRESS,
          toAddress: payload.address,
          amount: [
            {
              denom: CDENOM_TOKENS[payload.tokenType],
              amount: fromHumanString(payload.amount.toString(), 6).toString(),
            },
          ],
        }),
      ];
      
      // console.log('widthDrawResult', { res });
      assertIsDeliverTxSuccess(res);
      return res.transactionHash;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  public balanceDeposit = async (data, userId) => {
    try {
      const checkParam = {
        amount: data.amount,
        tokenType: data.tokenType,
        address: data.address,
        txHash: data.txHash,
      };
      const duplicateTx = await this.getItem({ txHash: data.txHash });

      if (!duplicateTx) {
        const depositStatus = await this.checkDepositPayment(checkParam);

        if (depositStatus) {
          const newPayment = await this.create({
            walletAddress: data.address,
            amount: data.amount,
            txHash: data.txHash,
            denom: data.tokenType,
            type: "Deposit",
            userId,
          });
          return newPayment;
        }

        return null;
      }

      return null;
    } catch (ex) {
      const errorMessage = `Error finding all payments: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return null;
    }
  };

  public balanceWithdraw = async (data, userId) => {
    try {
      const txHash = await this.withDrawToUser(data);

      if (!txHash) {
        return null;
      }

      const newPayment = await this.create({
        walletAddress: data.address,
        amount: data.amount,
        txHash: txHash,
        denom: data.tokenType,
        type: "Withdraw",
        userId,
      });

      return newPayment;
    } catch (ex) {
      const errorMessage = `Error finding all payments: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return null;
    }
  };
}
