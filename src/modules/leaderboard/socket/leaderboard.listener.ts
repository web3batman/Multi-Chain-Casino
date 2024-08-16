import { Namespace, Server, Socket } from "socket.io";

import { ESOCKET_NAMESPACE } from "@/constant/enum";
import TraitController from "@/modules/trait/trait.controller";
import logger from "@/utils/logger";

import { LeaderboardController } from "../leaderboard.controller";
import { LeaderboardService } from "../leaderboard.service";

class LeaderboardSocketListener {
  private socketServer: Namespace;
  private leaderboardService: LeaderboardService;
  private leaderboardController: LeaderboardController;
  private traitController: TraitController;

  private logPrefix = "[Leaderboard Socket:::]";

  constructor(socketServer: Server) {
    // Initialize service
    this.leaderboardService = new LeaderboardService();
    this.leaderboardController = new LeaderboardController();
    this.traitController = new TraitController();

    this.socketServer = socketServer.of(ESOCKET_NAMESPACE.leaderboard);
    this.initializeListener();
    this.subscribeListener();
  }

  private subscribeListener(): void {
    this.socketServer.on("connection", (_socket: Socket) => {
      // this.initializeSubscribe(socket);
    });
  }

  private initializeListener = async () => {
    try {
      const emitLeaderboard = async () => {
        const start = Date.now();
        
        const leaderboardResponse =
          await this.leaderboardService.getTopLearderboards(
            10,
           
          );

        if (
          leaderboardResponse &&
          Object.keys(leaderboardResponse).length > 0
        ) {
          this.socketServer.emit("leaderboard-fetch-all", {
            message: "success",
            leaderboard: leaderboardResponse!,
          });
        } else {
          this.socketServer.emit(
            "notify-error",
            "Error ocurred when fetched leaderboard!"
          );
        }

        const elapsed = Date.now() - start;
        setTimeout(emitLeaderboard, Math.max(0, 20000 - elapsed));
      };

      emitLeaderboard();
    } catch (error) {
      logger.error(this.logPrefix + "Emit leaderboard error: " + error);
    }
  };
}

export default LeaderboardSocketListener;
