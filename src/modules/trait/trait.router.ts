import actionHandler from "@/middleware/action-handler";
import checkPermissions from "@/middleware/check-permissions";
import validateSchema from "@/middleware/validate-schema";
import { BaseRouter } from "@/utils/base";
import * as mapProperty from "@/utils/interfaces";

import { ROLE } from "../user/user.constant";
import TraitController from "./trait.controller";
import * as validateTrait from "./trait.validate";

export default class TraitRouter extends BaseRouter {
  private traitController: TraitController;

  constructor() {
    super();
    this.traitController = new TraitController();
    this.routes();
  }

  public routes(): void {
    this.router.post(
      "/",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      validateSchema(validateTrait.createValidate, mapProperty.getBody),
      actionHandler(this.traitController.create, mapProperty.getBody)
    );

    
  }
}
