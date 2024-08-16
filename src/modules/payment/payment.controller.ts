import { FilterQuery } from "mongoose";

import { ADMIN_WALLET_ADDRESS } from "@/config";
import { CDENOM_TOKENS } from "@/constant/crypto";
import AESWrapper from "@/utils/encryption/aes-wrapper";
import { CustomError } from "@/utils/helpers";
import * as localizations from "@/utils/localizations";
import ILocalization from "@/utils/localizations/localizations.interface";
import logger from "@/utils/logger";

import { IAuthInfo } from "../auth/auth.types";
import UserService from "../user/user.service";
import { IPaymentModel } from ".";
import { PaymentService } from "./payment.service";

export class PaymentController {
  // Services
  private paymentService: PaymentService;
  private userService: UserService;

  // Diff services
  private localizations: ILocalization;

  constructor() {
    this.paymentService = new PaymentService();
    this.userService = new UserService();

    this.localizations = localizations["en"];
  }

  public getAll = async () => {
    const paymentFilter = <FilterQuery<IPaymentModel>>{};
    const [item, count] = await Promise.all([
      this.paymentService.get(paymentFilter),
      this.paymentService.getCount(paymentFilter),
    ]);

    return {
      item,
      count,
    };
  };

  public getByName = async (name) => {
    const payment = await this.paymentService.getItem({ name });

    // need add to localizations
    if (!payment) {
      throw new CustomError(404, "Payment not found");
    }

    return payment;
  };

  public getById = async (paymentId) => {
    const payment = await this.paymentService.getItemById(paymentId);

    // need add to localizations
    if (!payment) {
      throw new CustomError(404, "Payment not found");
    }

    return payment;
  };

  public create = async (payment) => {
    try {
      return await this.paymentService.create(payment);
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
      }

      throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
    }
  };

  public update = async ({ id }, paymentData) => {
    try {
      const payment = await this.paymentService.updateById(id, paymentData);

      // need add to localizations
      if (!payment) {
        throw new CustomError(404, "Payment not found");
      }

      return payment;
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
      } else if (error.status) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
      }
    }
  };

  public delete = async ({ id }) => {
    const payment = await this.paymentService.deleteById(id);

    // need add to localizations
    if (!payment) {
      throw new CustomError(404, "Payment not found");
    }

    return payment;
  };

  public userBalanceWithdraw = async (
    { amount, currency, address },
    { userId }: IAuthInfo
  ) => {
    const withdrawParam = {
      address: address,
      amount: amount,
      tokenType: currency,
    };

    try {
      if (Object.keys(CDENOM_TOKENS).indexOf(currency) == -1) {
        throw new CustomError(409, "Balance type is not supported");
      }

      const user = await this.userService.getItemById(userId);
      const updateParams = `wallet.${currency}`;
      const walletValue = user?.wallet?.[currency] ?? 0;
      let updateValue = 0;

      if (walletValue < amount) {
        throw new CustomError(409, "not enough token balances");
      } else {
        updateValue = walletValue - amount;
        let updatedUser = await this.userService.updateUserBalance(
          userId,
          updateParams,
          updateValue
        );

        // user withdraw crypto to admin wallet
        try {
          const resPayment = await this.paymentService.balanceWithdraw(
            withdrawParam,
            userId
          );

          if (!resPayment) {
            throw new CustomError(409, "unable withdraw");
          }
        } catch {
          updatedUser = await this.userService.updateUserBalance(
            userId,
            updateParams,
            walletValue
          );
          logger.error(
            `[Payment failed] user: ${userId} paymentInfo: ${JSON.stringify(withdrawParam)}`
          );
        }

        logger.info(
          `[Payment success] user: ${userId} paymentInfo: ${JSON.stringify(withdrawParam)}`
        );
        return updatedUser;
      }
    } catch (error) {
      logger.error(
        `[Payment failed] user: ${userId} paymentInfo: ${JSON.stringify(withdrawParam)}`
      );
      throw new CustomError(409, "updating balance error");
    }
  };

  public getAddress = async () => {
    try {
      const address = ADMIN_WALLET_ADDRESS ?? "";
      const aesKey = AESWrapper.generateKey();
      const encryptedAddress = AESWrapper.createAesMessage(aesKey, address);
      return {
        encryptedAddress,
        aesKey: aesKey.toString("base64"),
      };
    } catch (ex) {
      const errorMessage = `Error encrypting address: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return {
        error: errorMessage,
      };
    }
  };

  public userBalanceDeposit = async (
    { amount, currency, address, txHash },
    { userId }: IAuthInfo
  ) => {
    const depositParam = {
      address: address,
      txHash: txHash ?? "",
      amount: amount,
      tokenType: currency,
    };

    try {
      if (Object.keys(CDENOM_TOKENS).indexOf(currency) == -1) {
        throw new CustomError(409, "Balance type is not supported");
      }

      const user = await this.userService.getItemById(userId);
      const updateParams = `wallet.${currency}`;

      const walletValue = user?.wallet?.[currency] ?? 0;
      let updateValue = 0;

      // user deposit crypto to admin wallet
      const resPayment = await this.paymentService.balanceDeposit(
        depositParam,
        userId
      );

      if (!resPayment) {
        logger.error(
          `[Payment failed] deposit user - unable deposit: ${userId} paymentInfo: ${JSON.stringify(depositParam)}`
        );
        throw new CustomError(409, "unable deposit");
      }

      logger.info(
        `[Payment success] deposit user: ${userId} paymentInfo: ${JSON.stringify(depositParam)}`
      );

      updateValue = walletValue + amount;
      return await this.userService.updateUserBalance(
        userId,
        updateParams,
        updateValue
      );
    } catch (error) {
      logger.error(
        `[Payment failed] deposit user: ${userId} paymentInfo: ${JSON.stringify(depositParam)}`
      );
      throw new CustomError(409, "updating balance error");
    }
  };
}
