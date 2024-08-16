import actionHandler from "@/middleware/action-handler";
import checkPermissions from "@/middleware/check-permissions";
import { ROLE } from "@/modules/user/user.constant";
import { BaseRouter } from "@/utils/base";
import * as mapProperty from "@/utils/interfaces";

import { LogsController } from ".";

export default class LogsRouter extends BaseRouter {
  private logController: LogsController;

  constructor() {
    super();

    this.logController = new LogsController();
    this.routes();
  }

  public routes(): void {
    this.router.get(
      "/",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      actionHandler(this.logController.list, mapProperty.getQuery)
    );

    this.router.get(
      "/:id",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      actionHandler(this.logController.get, mapProperty.getIdFromParams)
    );
  }
}
