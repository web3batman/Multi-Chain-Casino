import actionHandler from "@/middleware/action-handler";
import checkPermissions from "@/middleware/check-permissions";
import validateSchema from "@/middleware/validate-schema";
import { BaseRouter } from "@/utils/base";
import * as mapProperty from "@/utils/interfaces";
import * as validations from "@/utils/validations";

import { ROLE } from "./user-bot.constant";
import UserBotController from "./user-bot.controller";

export default class UserBotRouter extends BaseRouter {
  private userBotController: UserBotController;

  constructor() {
    super();

    this.userBotController = new UserBotController();

    this.routes();
  }

  public routes(): void {
    this.router.get(
      "/",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      validateSchema(validations.getListValidation, mapProperty.getQuery),
      actionHandler(this.userBotController.getUsers, mapProperty.getQuery)
    );
  }
}
