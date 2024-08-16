import { Router } from "express";

// import swaggerUi from "swagger-ui-express";
import AuthRouter from "./modules/auth/auth.router";
import AutoCrashBetRouter from "./modules/auto-crash-bet/auto-crash-bet.router";
import ChatHistoryRouter from "./modules/chat-history/chat-history.router";
import CrashGameRouter from "./modules/crash-game/crash-game.router";
import DashboardRouter from "./modules/dashboard/dashboard.router";
import LogsRouter from "./modules/logs/logs.router";
import PaymentRouter from "./modules/payment/payment.router";
import SiteTransactionRouter from "./modules/site-transaction/site-transaction.router";
import StakingRouter from "./modules/staking/staking.router";
import UserRouter from "./modules/user/user.router";
import UserBotRouter from "./modules/user-bot/user-bot.router";
import TraitRouter from "./modules/trait/trait.router";
// import swaggerSetup from "./utils/swagger/swagger.setup";

export default class RootRouter {
  public router: Router;

  constructor() {
    this.router = Router();

    this.routes();
  }

  public routes(): void {
    // this.router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSetup))

    this.router.use("/auth", new AuthRouter().router);
    this.router.use("/dashboard", new DashboardRouter().router);
    this.router.use("/auto-crash-bet", new AutoCrashBetRouter().router);
    this.router.use("/logs", new LogsRouter().router);
    this.router.use("/chat-history", new ChatHistoryRouter().router);
    this.router.use("/crash-game", new CrashGameRouter().router);
    this.router.use("/site-transaction", new SiteTransactionRouter().router);
    this.router.use("/payment", new PaymentRouter().router);
    this.router.use("/user", new UserRouter().router);
    this.router.use("/user-bot", new UserBotRouter().router);
    this.router.use("/staking", new StakingRouter().router);
    this.router.use("/trait", new TraitRouter().router);

    this.router.get("/version", (_req, res) => res.json({ version: 1 }));
    this.router.get("/status", (_req, res) =>
    );
  }
}
