import actionHandler from "@/middleware/action-handler";
import checkPermissions from "@/middleware/check-permissions";
import { ROLE } from "@/modules/user/user.constant";
import { BaseRouter } from "@/utils/base";

// import * as validations from "@/utils/validations";
import { AutoCrashBetController } from "./";

export default class AutoCrashBetRouter extends BaseRouter {
  private autoCrashBetController: AutoCrashBetController;

  constructor() {
    super();

    this.autoCrashBetController = new AutoCrashBetController();
    this.routes();
  }

  public routes(): void {
    this.router.get(
      "/",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      actionHandler(this.autoCrashBetController.getAll)
    );
  }
}
