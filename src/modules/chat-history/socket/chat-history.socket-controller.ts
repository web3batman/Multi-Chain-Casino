import jwt, { JwtPayload } from "jsonwebtoken";
import { Namespace, Socket } from "socket.io";

import { TOKEN_SECRET } from "@/config";
import { IUserModel } from "@/modules/user/user.interface";
import UserService from "@/modules/user/user.service";
import { TChatUser } from "@/modules/user/user.types";
import logger from "@/utils/logger";

import { EChatHistoryEvents } from "../chat-history.constant";
import { ChatHistoryService } from "../chat-history.service";

class ChatHistorySocketHandler {
  private socket: Socket;
  private socketNameSpace: Namespace;
  private loggedIn = false;
  private user: IUserModel | null = null;
  private logoPrefix: string = "[Chat Socket Handler]::: ";

  private chatHistoryService: ChatHistoryService;
  private userService: UserService;

  constructor(socketNameSpace: Namespace, socket: Socket) {
    this.socket = socket;
    this.socketNameSpace = socketNameSpace;
    this.chatHistoryService = new ChatHistoryService();
    this.userService = new UserService();
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
          return this.socket.emit(
            "notify-success",
            "Successfully authenticated!"
          );
        }
      }
      // return socket.emit("alert success", "Socket Authenticated!");
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

  public sendMessageHandler = async (message: string) => {
    try {
      if (!this.loggedIn) {
        return this.socket.emit("notify-error", `You are not logged in!`);
      }

      const newChatHistory = await this.chatHistoryService.create({
        message: message,
        user: this.user?._id,
      });

      const userdata: TChatUser = {
        _id: this.user?._id ?? "",
        username: this.user?.username ?? "",
        avatar: this.user?.avatar ?? "",
        hasVerifiedAccount: this.user?.hasVerifiedAccount ?? true,
        createdAt: this.user?.createdAt ?? new Date(),
      };
      const emitData = {
        _id: newChatHistory?._id,
        user: userdata,
        message: message,
        sentAt: newChatHistory?.sentAt,
      };

      this.socketNameSpace.emit(EChatHistoryEvents.b2fMessage, emitData);
    } catch (error) {
      logger.error(this.logoPrefix + "Send message error occured" + error);
      return this.socket.emit(
        "notify-error",
        `An error is occured on save chat history!`
      );
    }
  };

  public disconnectHandler = async () => {};

  public getChatHistoryHandler = async (sentAt: Date) => {
    let previousChatHistory;

    if (sentAt) {
      previousChatHistory =
        await this.chatHistoryService.fetchEarlierChatHistories(sentAt, 5);
    } else {
      previousChatHistory =
        await this.chatHistoryService.fetchEarlierChatHistories(new Date(), 15);
    }

    if (previousChatHistory?.length > 0) {
      this.socket.emit("send-chat-history", {
        message: "success",
        chatHistories: previousChatHistory,
      });
    } else {
      this.socket.emit(
        "notify-error",
        "Error ocurred when fetched previous chat histories!"
      );
    }
  };
}

export default ChatHistorySocketHandler;
