import actionHandler from "@/middleware/action-handler";
import checkPermissions from "@/middleware/check-permissions";
import validateSchema from "@/middleware/validate-schema";
import { BaseRouter } from "@/utils/base";
import * as mapProperty from "@/utils/interfaces";
import * as validations from "@/utils/validations";

import { ROLE } from "../user/user.constant";
import StakingController from "./staking.controller";
import * as validateStaking from "./staking.validate";

export default class StakingRouter extends BaseRouter {
  private stakingController: StakingController;

  constructor() {
    super();
    this.stakingController = new StakingController();
    this.routes();
  }

  public routes(): void {
    this.router.get(
      "/",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      validateSchema(validations.getListValidation, mapProperty.getQuery),
      actionHandler(this.stakingController.getAll, mapProperty.getQuery)
    );

    this.router.post(
      "/create",
      validateSchema(validateStaking.createValidate, mapProperty.getBody),
      actionHandler(this.stakingController.create, mapProperty.getBody)
    );

    this.router.get(
      "/history",
      actionHandler(this.stakingController.stakeHistory, mapProperty.getQuery)
    );

    this.router.get(
      "/user",
      actionHandler(this.stakingController.getUserStaking, mapProperty.getQuery)
    );
  }
}
