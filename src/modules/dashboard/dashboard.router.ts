import actionHandler from "@/middleware/action-handler";
import checkPermissions from "@/middleware/check-permissions";
import { ROLE } from "@/modules/user/user.constant";
import { BaseRouter } from "@/utils/base";
import * as mapProperty from "@/utils/interfaces";

import { DashboardController } from ".";

export default class DashboardRouter extends BaseRouter {
  private dashboardController: DashboardController;

  constructor() {
    super();

    this.dashboardController = new DashboardController();
    this.routes();
  }

  public routes(): void {
    this.router.get(
      "/",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      actionHandler(this.dashboardController.getAll)
    );

    this.router.post(
      "/dashboard-history",
      checkPermissions(),
      actionHandler(this.dashboardController.getDashboard, mapProperty.getQuery)
    );

    this.router.get(
      "/top-players",
      checkPermissions(),
      actionHandler(this.dashboardController.getTopPlayers)
    );
  }
}
