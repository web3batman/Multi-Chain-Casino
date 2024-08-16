import { verifyADR36Amino } from "@keplr-wallet/cosmos";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Event as SocketEvent, Namespace, Socket } from "socket.io";

import { ADMIN_WALLET_ADDRESS, TOKEN_SECRET } from "@/config";
import { IUserModel } from "@/modules/user/user.interface";
import UserService from "@/modules/user/user.service";
import AESWrapper from "@/utils/encryption/aes-wrapper";
import { fromBase64 } from "@/utils/helpers/string-helper";
import logger from "@/utils/logger";

import { EPaymentEvents } from "../payment.constant";
import { PaymentController } from "../payment.controller";
import { TSocketDepositParam, TSocketWithDrawParam } from "../payment.types";

class PaymentSocketHandler {
  private socket: Socket;
  private socketNameSpace: Namespace;
  private loggedIn = false;
  private user: IUserModel | null = null;
  private logoPrefix: string = "[Payment Socket Handler]::: ";
  private paymentController: PaymentController;
  private aesKey: Buffer;

  private userService: UserService;

  constructor(socketNameSpace: Namespace, socket: Socket) {
    this.userService = new UserService();
    this.paymentController = new PaymentController();

    this.socket = socket;
    this.socketNameSpace = socketNameSpace;
  }

  public authHandler = async (token: string) => {
    if (!token) {
      this.loggedIn = false;
      this.user = null;
      return this.socket.emit(
        "error",
        "No authentication token provided, authorization declined"
      );
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, TOKEN_SECRET) as JwtPayload;
      this.user = await this.userService.getItemById(decoded.userId);

      if (this.user) {
        if (parseInt(this.user.banExpires) > new Date().getTime()) {
          this.loggedIn = false;
          this.user = null;
          return this.socket.emit("user banned");
        } else {
          this.loggedIn = true;
          this.socket.join(String(this.user._id));
          logger.info(this.logoPrefix + "User connected: " + this.user._id);

          await this.getAdminWalletInfo();

          this.socketNameSpace
            .to(String(this.user._id))
            .emit("notify-success", "Authentication success");
        }
      }
    } catch (error) {
      this.loggedIn = false;
      logger.error(this.logoPrefix + "Auth error occured" + error);
      this.user = null;
      return this.socket.emit(
        "notify-error",
        "Authentication token is not valid"
      );
    }
  };

  public depositHandler = async (depositParamString: string) => {
    try {
      if (!this.loggedIn || !this.user?._id) {
        return this.socket.emit("notify-error", `You are not logged in!`);
      }

      const depositParam: TSocketDepositParam = JSON.parse(
        AESWrapper.decrypt(this.aesKey, depositParamString)
      );

      const isValid = verifyADR36Amino(
      );

      if (!isValid) {
        logger.error(
          this.logoPrefix +
            "Deposit failed" +
            "Invalid signature" +
            "user" +
            this.user._id +
            " deposit param:" +
            JSON.stringify(depositParam)
        );
        return this.socketNameSpace
          .to(String(this.user._id))
          .emit(EPaymentEvents.paymentFailed, `Deposit Failed`);
      }

      const resDeposit = await this.paymentController.userBalanceDeposit(
        depositParam,
        {
          userId: this.user._id,
          role: this.user.role,
          status: this.user.status,
        }
      );

      if (
        typeof resDeposit === "object" &&
        "status" in resDeposit &&
        resDeposit.status !== "success"
      ) {
        logger.error(
          this.logoPrefix +
            "Deposit failed" +
            "Invalid deposit parameters " +
            "user" +
            this.user._id +
            " deposit param:" +
            JSON.stringify(depositParam)
        );
        return this.socketNameSpace
          .to(String(this.user._id))
          .emit(EPaymentEvents.paymentFailed, `Deposit Failed`);
      }

      if (typeof resDeposit !== "object") {
        logger.error(
          this.logoPrefix +
            "Deposit failed" +
            "Invalid deposit parameters " +
            "user" +
            this.user._id +
            " deposit param:" +
            JSON.stringify(depositParam)
        );
        return this.socketNameSpace
          .to(String(this.user._id))
          .emit(EPaymentEvents.paymentFailed, `Deposit Failed`);
      }

      this.socketNameSpace
        .to(String(this.user._id))
        .emit(EPaymentEvents.paymentFailed, `Deposit Success`);
      return this.socketNameSpace
        .to(String(this.user._id))
        .emit(EPaymentEvents.updateBalance, {
          walletValue: resDeposit.data?.[depositParam.currency],
          denom: depositParam.currency,
        });
    } catch (error) {
      logger.error(this.logoPrefix + "Deposit failed" + error);
      return this.socket.emit(EPaymentEvents.paymentFailed, `Deposit Failed`);
    }
  };

  public withdrawHandler = async (withdrawParamString: string) => {
    try {
      const withdrawParam: TSocketWithDrawParam = JSON.parse(
        AESWrapper.decrypt(this.aesKey, withdrawParamString)
      );

      if (!this.loggedIn || !this.user?._id) {
        return this.socket.emit("notify-error", `You are not logged in!`);
      }

      if (this.user.signAddress !== withdrawParam.address) {
        return this.socketNameSpace
          .to(String(this.user._id))
          .emit(EPaymentEvents.paymentFailed, `Connect withdraw wallet`);
      }

      const isValid = verifyADR36Amino(
       
      );

      if (!isValid) {
        logger.error(
          this.logoPrefix +
            "Deposit failed" +
            "Invalid signature" +
            "user" +
            this.user._id +
            " withdraw param:" +
            JSON.stringify(withdrawParam)
        );
        return this.socketNameSpace
          .to(String(this.user._id))
          .emit(EPaymentEvents.paymentFailed, `Invalid withdraw signature`);
      }

      const resWithdraw = await this.paymentController.userBalanceWithdraw(
        withdrawParam,
        {
          userId: this.user._id,
          role: this.user.role,
          status: this.user.status,
        }
      );

      if (
        typeof resWithdraw === "object" &&
        "status" in resWithdraw &&
        resWithdraw.status !== "success"
      ) {
        return this.socketNameSpace
          .to(String(this.user._id))
          .emit(EPaymentEvents.paymentFailed, `Withdraw Failed`);
      }

      if (typeof resWithdraw !== "object") {
        return this.socketNameSpace
          .to(String(this.user._id))
          .emit(EPaymentEvents.paymentFailed, `Withdraw Failed`);
      }

      this.socketNameSpace
        .to(String(this.user._id))
        .emit(EPaymentEvents.paymentFailed, `Withdraw Success`);
      return this.socketNameSpace
        .to(String(this.user._id))
        .emit(EPaymentEvents.updateBalance, {
          walletValue: resWithdraw.data?.[withdrawParam.currency],
          denom: withdrawParam.currency,
        });
    } catch (error) {
      logger.error(this.logoPrefix + "Withdraw failed" + error);
      return this.socket.emit(EPaymentEvents.paymentFailed, `Withdraw Failed`);
    }
  };

  public getAdminWalletInfo = async () => {
    try {
      if (!this.loggedIn || !this.user?._id) {
        return this.socket.emit("notify-error", `You are not logged in!`);
      }

      const address = ADMIN_WALLET_ADDRESS ?? "";
      this.aesKey = AESWrapper.generateKey();
      const encryptedAddress = AESWrapper.createAesMessage(
        this.aesKey,
        address
      );

      const adminRes = {
        address1: this.aesKey.toString("base64"),
        address2: encryptedAddress,
      };
      return this.socketNameSpace
        .to(String(this.user._id))
        .emit(EPaymentEvents.setAdminWallet, adminRes);
    } catch (error) {
      logger.error(this.logoPrefix + "Send message error occured" + error);
      return this.socket.emit(
        "notify-error",
        `An error is occured on withdarw!`
      );
    }
  };

  public banStatusCheckMiddleware = async (
    packet: SocketEvent,
    next: (err?: any) => void
  ) => {
    if (packet[0] === EPaymentEvents.login) {
      return next();
    }

    if (this.loggedIn && this.user) {
      try {
        // Check if user is banned
        if (
          this.user &&
          parseInt(this.user.banExpires) > new Date().getTime()
        ) {
          return this.socket.emit("user banned");
        } else {
          return next();
        }
      } catch (error) {
        return this.socket.emit("user banned");
      }
    } else {
      return this.socket.emit("user banned");
    }
  };

  public disconnectHandler = async () => {
    this.user = null;
  };
}

export default PaymentSocketHandler;
