import { Router } from "express";

import actionHandler from "@/middleware/action-handler";
import checkPermissions from "@/middleware/check-permissions";
import validateSchema from "@/middleware/validate-schema";
import * as mapProperty from "@/utils/interfaces";

import AuthController from "./auth.controller";
import * as validate from "./auth.validate";

export default class AuthRouter {
  public router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.routes();
  }

  public routes(): void {
    this.router.post(
      "/sign-up",
      validateSchema(validate.signUp, mapProperty.getBody),
      actionHandler(this.authController.signUp, [mapProperty.getBody])
    );

    this.router.post(
      "/sign-in",
      validateSchema(validate.signIn, mapProperty.getBody),
      actionHandler(this.authController.signIn, [mapProperty.getBody])
    );

    this.router.post(
      "/reset-password",
      validateSchema(validate.resetPassword, mapProperty.getBody),
      actionHandler(this.authController.resetPassword, [mapProperty.getBody])
    );

    this.router.post(
      "/update-token",
      validateSchema(validate.device, mapProperty.deviceInfo),
      validateSchema(validate.updateToken, mapProperty.getBody),
      actionHandler(this.authController.updateToken, [
        mapProperty.deviceInfo,
        mapProperty.getBody,
      ])
    );

    this.router.post(
      "/logout",
      checkPermissions(),
      validateSchema(validate.device, mapProperty.deviceInfo),
      actionHandler(this.authController.logout, [
        mapProperty.deviceInfo,
        mapProperty.getUserInfo,
      ])
    );
  }
}
