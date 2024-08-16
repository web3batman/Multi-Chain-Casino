import actionHandler from "@/middleware/action-handler";
import checkPermissions from "@/middleware/check-permissions";
import { ROLE } from "@/modules/user/user.constant";
import { BaseRouter } from "@/utils/base";

// import * as mapProperty from "@/utils/interfaces";
import { SiteTransactionController } from ".";

export default class SiteTransactionRouter extends BaseRouter {
  private siteTransactionController: SiteTransactionController;

  constructor() {
    super();

    this.siteTransactionController = new SiteTransactionController();
    this.routes();
  }

  public routes(): void {
    this.router.get(
      "/",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      actionHandler(this.siteTransactionController.getAll)
    );

    this.router.get("/:id", checkPermissions({ roles: [ROLE.ADMIN] }));
  }
}
