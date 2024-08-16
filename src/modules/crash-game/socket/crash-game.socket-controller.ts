import jwt, { JwtPayload } from "jsonwebtoken";
import _ from "lodash";
import mongoose from "mongoose";
import { Event as SocketEvent, Namespace, Socket } from "socket.io";

import { SITE_USER_ID, TOKEN_SECRET } from "@/config";
import { AutoCrashBetService } from "@/modules/auto-crash-bet";
import { SiteTransactionService } from "@/modules/site-transaction";
import { IUserModel } from "@/modules/user/user.interface";
import UserService from "@/modules/user/user.service";
import { getVipLevelFromWager } from "@/utils/customer/vip";
import * as localizations from "@/utils/localizations";
import ILocalization from "@/utils/localizations/localizations.interface";
import logger from "@/utils/logger";
import { getSiteCrashState } from "@/utils/setting/site";

import { CBET_STATES, CGAME_STATES } from "../crash-game.constant";
import {
  IUpdateParams,
  TAutoCrashBetPayload,
  TJoinGamePayload,
} from "../crash-game.interface";
import { CrashGameService } from "../crash-game.service";
import {
  IBetType,
  IGameStateType,
  TFormattedPlayerBetType,
} from "../crash-game.types";

export class CrashGameSocketController {
  // Services
  private crashGameService: CrashGameService;
  private userService: UserService;
  private autoCrashBetService: AutoCrashBetService;
  private siteTransactionService: SiteTransactionService;

  // Diff services
  private localizations: ILocalization;

  public static gameStatus: IGameStateType = {
    _id: null,
    status: CGAME_STATES.Starting,
    crashPoint: null,
    startedAt: null,
    duration: null,
    players: {},
    bots: {},
    pending: {},
    pendingCount: 0,
    botCount: 0,
    pendingBets: [],
    privateSeed: null,
    privateHash: null,
    publicSeed: null,
    connectedUsers: {},
  };

  public betStatus = {
    Playing: 1,
    CashedOut: 2,
  };

  // Logger config
  private logoPrefix: string = "[Crash Game UserSocket]::: ";

  // Socket setting
  private socketNameSpace: Namespace;

  // Socket
  private socket: Socket;

  // User status
  private loggedIn = false;
  private user: IUserModel | null = null;

  constructor() {
    this.crashGameService = new CrashGameService();
    this.userService = new UserService();
    this.autoCrashBetService = new AutoCrashBetService();
    this.siteTransactionService = new SiteTransactionService();

    this.localizations = localizations["en"];
  }

  public setSocketNamespace = (namespace: Namespace) => {
    this.socketNameSpace = namespace;
  };

  public setSocket = (socket: Socket) => {
    this.socket = socket;
  };
  public initializeSubscribe = async () => {
    const players = await _.map(
      CrashGameSocketController.gameStatus.players,
      (p) => CrashGameSocketController.formatPlayerBet(p)
    );
    this.socket.emit("game-status", {
      players,
      gameStatus: CrashGameSocketController.gameStatus,
    });
  };

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

      const user = await this.userService.getItem({ _id: decoded.userId });

      if (user) {
        if (parseInt(user.banExpires) > new Date().getTime()) {
          this.loggedIn = false;
          this.user = null;
          this.socket.emit("user banned");
        } else {
          this.loggedIn = true;
          this.user = user;

          this.socket.join(String(user._id));
          CrashGameSocketController.gameStatus.connectedUsers[
            user._id.toString()
          ] = this.socket.id;
          logger.info(
            this.logoPrefix +
              "User connect userId: " +
              user._id +
              " socketId: " +
              this.socket.id
          );
          // this.socket.emit("notify-success", "Successfully authenticated!");
        }
      }
      // this.socket.emit("notify-error", "Authentication token is not valid");
    } catch (error) {
      this.loggedIn = false;
      logger.error(this.logoPrefix + "auth error handle " + error);
      this.user = null;
      this.socket.emit("notify-error", "Authentication token is not valid");
    }
  };

  public getHistoryHandler = async (count: number) => {
    try {
      // Get the most recent documents with status 4, limited by the count parameter
      const history = await this.crashGameService.aggregateByPipeline([
        { $match: { status: 4 } },
        { $sort: { createdAt: -1 } },
        { $limit: count },
        { $project: { _id: 1, players: 1, crashPoint: 1 } },
      ]);

      this.socket.emit("previous-crashgame-history", history);
    } catch (error) {
      console.error("Error fetching previous crash game history:", error);
      this.socket.emit(
        "notify-error",
        "Error occurred when fetching previous crash game history!"
      );
    }
  };

  public autoCrashBetHandler = async (data: TAutoCrashBetPayload) => {
    if (!this.loggedIn) {
      return this.socket.emit("bet-cashout-error", "You are not logged in!");
    }

    try {
      const { betAmount, cashoutPoint, count, denom } = data;

      if (this.user?.wallet?.[denom] < betAmount) {
        return this.socket.emit(
          "crash-autobet-balance-error",
          "You don't have enough balance"
        );
      }

      if (this.user!.selfExcludes.crash > Date.now()) {
        return this.socket.emit(
          "game-join-error",
          "You have self-excluded yourself for another 1 hour!"
        );
      }

      const bet = await this.autoCrashBetService.getItem({
        user: this.user._id,
        status: true,
      });

      if (bet && bet.status && bet.count > 0) {
        return this.socket.emit(
          "game-join-error",
          "You already have a bet in progress!"
        );
      }

      await this.autoCrashBetService.create({
        user: new mongoose.Types.ObjectId(this.user._id),
        betAmount,
        cashoutPoint,
        count,
        status: true,
        denom: denom,
      });
      return this.socket.emit(
        "auto-crashgame-join-success",
        "Autobet will begin with the next round."
      );
    } catch (error) {
      console.error("autoCrashBet >>>", error);
      return this.socket.emit(
        "notify-error",
        "There was an error while placing your autobet."
      );
    }
  };

  public cancelAutoBetHandler = async () => {
    try {
      if (!this.loggedIn) {
        return this.socket.emit("notify-error", "You are not logged in!");
      }

      const userId = this.user!._id.toString();
      const bet = await this.autoCrashBetService.getItem({ user: userId });

      if (bet) {
        await this.autoCrashBetService.delete({ _id: bet._id });
        return this.socket.emit(
          "auto-crashgame-join-success",
          "Autobet has been canceled."
          // 'Autobet has been canceled, effective from the next round.'
        );
      }
    } catch (error) {
      console.error("cancelAutoBet >>>", error);
      return this.socket.emit(
        "notify-error",
        "There was an error while canceling your autobet."
      );
    }
  };

  public joinGameHandler = async (
    data: TJoinGamePayload,
    emitPlayersBet: () => void
  ) => {
    const { target, betAmount: crashBetAmount, denom } = data;

    if (!this.loggedIn) {
      return this.socket.emit("game-join-error", "You are not logged in!");
    }

    const userId = this.user!._id.toString();

    if (typeof crashBetAmount !== "number" || isNaN(crashBetAmount)) {
      return this.socket.emit("game-join-error", "Invalid betAmount type!");
    }

    // Get crash enabled status
    const isEnabled = getSiteCrashState();

    // If crash is disabled
    if (!isEnabled) {
      return this.socket.emit(
        "game-join-error",
        "Crash is currently disabled! Contact admins for more information."
      );
    }

    if (CrashGameSocketController.gameStatus.status !== CGAME_STATES.Starting) {
      return this.socket.emit(
        "game-join-error",
        "Game is currently in progress!"
      );
    }

    // Check if user already betted
    if (
      CrashGameSocketController.gameStatus.pending[userId] ||
      CrashGameSocketController.gameStatus.players[userId]
    ) {
      return this.socket.emit("game-join-error", "Already joined game");
    }

    let autoCashOut = -1;

    // Validation on the target value, if acceptable assign to auto cashout
    if (typeof target === "number" && !isNaN(target) && target > 100) {
      autoCashOut = target;
    }

    CrashGameSocketController.gameStatus.pending[userId] = {
      betAmount: crashBetAmount,
      denom,
      autoCashOut,
      username: this.user!.username,
    };

    CrashGameSocketController.gameStatus.pendingCount++;

    try {
      this.user = await this.userService.getItemById(userId);
      // If user is self-excluded

      if (this.user!.selfExcludes.crash > Date.now()) {
        return this.socket.emit(
          "game-join-error",
          `You have self-excluded yourself for another ${((this.user!.selfExcludes.crash - Date.now()) / 3600000).toFixed(1)} hours.`
        );
      }

      // If user has restricted bets
      if (this.user!.betsLocked) {
        delete CrashGameSocketController.gameStatus.pending[userId];
        CrashGameSocketController.gameStatus.pendingCount--;
        return this.socket.emit(
          "game-join-error",
          "Your account has an betting restriction. Please contact support for more information."
        );
      }

      // If user can afford this bet
      if (
        (this.user!.wallet?.[denom] ?? 0) <
        parseFloat(crashBetAmount.toFixed(2))
      ) {
        delete CrashGameSocketController.gameStatus.pending[userId];
        CrashGameSocketController.gameStatus.pendingCount--;
        return this.socket.emit(
          "game-join-error",
          "You can't afford this bet!"
        );
      }

      const newWalletValue =
        (this.user!.wallet?.[denom] || 0) -
        Math.abs(parseFloat(crashBetAmount.toFixed(2)));
      const newWagerValue =
        (this.user!.wager?.["crash"]?.[denom] || 0) +
        Math.abs(parseFloat(crashBetAmount.toFixed(2)));
      const newWagerNeededForWithdrawValue =
        (this.user!.wagerNeededForWithdraw?.[denom] || 0) +
        Math.abs(parseFloat(crashBetAmount.toFixed(2)));
      const newLeaderboardValue =
        (this.user!.leaderboard?.["crash"]?.[denom]?.betAmount || 0) +
        Math.abs(parseFloat(crashBetAmount.toFixed(2)));

      // Remove bet amount from user's balance
      this.user = await this.userService.updateById(userId, {
        $set: {
          [`wallet.${denom}`]: newWalletValue,
          [`wager.crash.${denom}`]: newWagerValue,
          [`wagerNeededForWithdraw.${denom}`]: newWagerNeededForWithdrawValue,
          [`leaderboard.crash.${denom}.betAmount`]: newLeaderboardValue,
        },
      });
      const newWalletTxData = {
        userId,
        amount: -Math.abs(parseFloat(crashBetAmount.toFixed(2))),
        reason: "Crash Bet",
        crashGameId: CrashGameSocketController.gameStatus._id,
      };

      await this.siteTransactionService.create(newWalletTxData);

      // Update local wallet
      this.socket.emit("update-wallet", newWalletValue, denom);

      // Creating new bet object
      const newBet = {
        autoCashOut,
        betAmount: crashBetAmount,
        denom,
        playerID: userId,
        username: this.user!.username,
        avatar: this.user!.avatar,
        level: getVipLevelFromWager(
          this.user!.wager ? this.user!.wager?.[denom] ?? 0 : 0
        ),
        status: this.betStatus.Playing,
        forcedCashout: false,
      };

      // Add revenue to the site wallet
      const siteUser = await this.userService.getSiteUserData();

      if (siteUser) {
        let newSiteWalletValue = 0;
        let newSiteCrashWalletValue = 0;

        if (siteUser?.wallet) {
          newSiteWalletValue =
            (siteUser?.wallet?.[denom] || 0) + crashBetAmount;
        } else {
          newSiteWalletValue = crashBetAmount;
        }

        if (siteUser?.leaderboard?.["crash"]) {
          newSiteCrashWalletValue =
            (siteUser?.leaderboard?.["crash"]?.[denom]?.winAmount || 0) +
            crashBetAmount;
        } else {
          newSiteCrashWalletValue = crashBetAmount;
        }

        await this.userService.updateById(SITE_USER_ID, {
          $set: {
            [`wallet.${denom}`]: newSiteWalletValue,
            [`leaderboard.crash.${denom}.winAmount`]: newSiteCrashWalletValue,
          },
        });
      } else {
        logger.error(this.logoPrefix + "Couldn't find site user!");
      }

      // Updating in db
      const updateParam: IUpdateParams = { $set: {} };
      updateParam.$set["players." + userId] = newBet;
      await this.crashGameService.update(
        { _id: CrashGameSocketController.gameStatus._id },
        updateParam
      );

      // Assign to state
      CrashGameSocketController.gameStatus.players[userId] = newBet;
      CrashGameSocketController.gameStatus.pendingCount--;

      const formattedBet = CrashGameSocketController.formatPlayerBet(newBet);
      CrashGameSocketController.gameStatus.pendingBets.push(formattedBet);
      emitPlayersBet();

      return this.socket.emit("crashgame-join-success", formattedBet);
    } catch (error) {
      logger.error(this.logoPrefix + error);

      delete CrashGameSocketController.gameStatus.pending[userId];
      CrashGameSocketController.gameStatus.pendingCount--;

      return this.socket.emit(
        "game-join-error",
        "There was an error while proccessing your bet"
      );
    }
  };

  public betCashoutHandler = async (
    doCashOut: (
      bet: string,
      at: number,
      forced: boolean,
      callback: (err: any, result: any) => void
    ) => void
  ) => {
    if (!this.loggedIn) {
      return this.socket.emit("bet-cashout-error", "You are not logged in!");
    }

    // Check if game is running
    if (
      CrashGameSocketController.gameStatus.status !== CGAME_STATES.InProgress
    ) {
      return this.socket.emit(
        "bet-cashout-error",
        "There is no game in progress!"
      );
    }

    // Calculate the current multiplier
    const elapsed =
      Date.now() - CrashGameSocketController.gameStatus.startedAt!.getTime();
    let at = this.growthFunc(elapsed);

    // Check if cashout is over 1x
    if (at < 101) {
      return this.socket.emit(
        "bet-cashout-error",
        "The minimum cashout is 1.01x!"
      );
    }

    // Find bet from state
    const bet =
      CrashGameSocketController.gameStatus.players[this.user!._id.toString()];

    // Check if bet exists
    if (!bet) {
      return this.socket.emit("bet-cashout-error", "Coudn't find your bet!");
    }

    // Check if the current multiplier is over the auto cashout
    if (bet.autoCashOut > 100 && bet.autoCashOut <= at) {
      at = bet.autoCashOut;
    }

    // Check if current multiplier is even possible
    if (at > CrashGameSocketController.gameStatus.crashPoint!) {
      return this.socket.emit("bet-cashout-error", "Already game ended");
    }

    // Check if user already cashed out
    if (bet.status !== this.betStatus.Playing) {
      return this.socket.emit("bet-cashout-error", "Already cashed out");
    }

    // Send cashout request to handler
    doCashOut(bet.playerID, at, false, (err, result) => {
      if (err) {
        logger.error(
          `Crash >> There was an error while trying to cashout a player` + err
        );
        return this.socket.emit(
          "bet-cashout-error",
          "There was an error while cashing out!"
        );
      }

      this.socket.emit("bet-cashout-success", result);
    });
  };

  public disconnectHandler = async () => {
    if (this.loggedIn && this.user?._id) {
      delete CrashGameSocketController.gameStatus.connectedUsers[
        this.user._id.toString()
      ]; // Remove user from connected list
    }
  };

  public banStatusCheckMiddleware = async (
    _packet: SocketEvent,
    next: (err?: any) => void
  ) => {
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
      return next();
    }
  };

  public getGameStatus = async () => {
    return CrashGameSocketController.gameStatus;
  };

  public static formatPlayerBet = (bet: IBetType): TFormattedPlayerBetType => {
    const formatted: TFormattedPlayerBetType = {
      playerID: bet.playerID,
      username: bet.username,
      avatar: bet.avatar,
      betAmount: bet.betAmount,
      denom: bet.denom,
      status: bet.status,
      level: bet.level,
      autobet: bet.autobet,
    };

    if (bet.status !== CBET_STATES.Playing) {
      formatted.stoppedAt = bet.stoppedAt;
      formatted.winningAmount = bet.winningAmount;
    }

    return formatted;
  };

  public growthFunc = (ms: number) =>
    Math.floor(100 * Math.pow(Math.E, 0.00006 * ms));
}
