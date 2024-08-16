import { Namespace, Server, Socket } from "socket.io";

import { ESOCKET_NAMESPACE } from "@/constant/enum";

import { EChatHistoryEvents } from "../chat-history.constant";
import ChatHistorySocketHandler from "./chat-history.socket-controller";

class ChatHistorySocketListener {
  private socketServer: Namespace;
  private logoPrefix: string = "[Chat Socket]::: ";

  constructor(socketServer: Server) {
    this.socketServer = socketServer.of(ESOCKET_NAMESPACE.chat);
    this.subscribeListener();
  }

  private subscribeListener(): void {
    this.socketServer.on("connection", (socket: Socket) => {
      const chatHistorySocketHandler = new ChatHistorySocketHandler(
        this.socketServer,
        socket
      );
      // Auth handler
      socket.on(EChatHistoryEvents.auth, async (token: string) => {
        chatHistorySocketHandler.authHandler(token);
      });
      socket.on(EChatHistoryEvents.getChatHistory, async (sentAt: Date) => {
        chatHistorySocketHandler.getChatHistoryHandler(sentAt);
      });
      // Send message handler
      socket.on(EChatHistoryEvents.f2bMessage, async (message: string) => {
        chatHistorySocketHandler.sendMessageHandler(message);
      });
      // Disconnect Handler
      socket.on(EChatHistoryEvents.disconnect, async () => {
        chatHistorySocketHandler.disconnectHandler();
      });

      // // Check for users ban status
      // socket.use(this.banStatusCheckMiddleware);

      // // Throttle connections
      // socket.use(throttleConnections(socket));
    });
  }
}

export default ChatHistorySocketListener;
