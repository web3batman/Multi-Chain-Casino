import actionHandler from "@/middleware/action-handler";
import checkPermissions from "@/middleware/check-permissions";
import { ROLE } from "@/modules/user/user.constant";
import { BaseRouter } from "@/utils/base";

import { CrashGameController } from ".";

export default class CrashGameRouter extends BaseRouter {
  private crashGameController: CrashGameController;

  constructor() {
    super();
    this.crashGameController = new CrashGameController();
    this.routes();
  }

  public routes(): void {
    this.router.get(
      "/",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      actionHandler(this.crashGameController.getAll)
    );
  }
}
