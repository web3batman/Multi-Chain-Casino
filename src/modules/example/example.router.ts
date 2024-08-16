import actionHandler from "@/middleware/action-handler";
import checkPermissions from "@/middleware/check-permissions";
import validateSchema from "@/middleware/validate-schema";
import { ROLE } from "@/modules/user/user.constant";
import { BaseRouter } from "@/utils/base";
import * as mapProperty from "@/utils/interfaces";
import * as validations from "@/utils/validations";

import {
  CreateExampleSchema,
  ExampleController,
  UpdateExampleSchema,
} from "./";
import * as mapPropertyExample from "./example.interface";

export default class ExampleRouter extends BaseRouter {
  private exampleController: ExampleController;

  constructor() {
    super();

    this.exampleController = new ExampleController();
    this.routes();
  }

  public routes(): void {
    this.router.get(
      "/",
      checkPermissions(),
      actionHandler(this.exampleController.getAll)
    );

    this.router.post(
      "/",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      validateSchema(CreateExampleSchema, mapProperty.getBody),
      actionHandler(this.exampleController.create, mapProperty.getBody)
    );

    this.router.get(
      "/name/:name",
      checkPermissions(),
      actionHandler(
        this.exampleController.getByName,
        mapProperty.getNameFromParam
      )
    );

    this.router.get(
      "/:id",
      checkPermissions(),
      validateSchema(
        validations.byId,
        mapPropertyExample.getIdFromParamsWithMe
      ),
      validateSchema(CreateExampleSchema, mapProperty.getBody),
      actionHandler(
        this.exampleController.getById,
        mapPropertyExample.getIdFromParamsWithMe
      )
    );

    this.router.put(
      "/:name",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      validateSchema(UpdateExampleSchema, mapProperty.getBody),
      actionHandler(this.exampleController.update, [
        mapProperty.getNameFromParam,
        mapProperty.getBody,
      ])
    );

    this.router.delete(
      "/:name",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      actionHandler(this.exampleController.delete, mapProperty.getNameFromParam)
    );
  }
}
