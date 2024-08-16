import actionHandler from "@/middleware/action-handler";
import checkPermissions from "@/middleware/check-permissions";
import { ROLE } from "@/modules/user/user.constant";
import { BaseRouter } from "@/utils/base";

import { PaymentController } from ".";

export default class PaymentRouter extends BaseRouter {
  private paymentController: PaymentController;

  constructor() {
    super();
    this.paymentController = new PaymentController();
    this.routes();
  }

  public routes(): void {
    this.router.get(
      "/",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      actionHandler(this.paymentController.getAll)
    );

    // this.router.post(
    //   "/withdraw",
    //   checkPermissions(),
    //   validateSchema(validatePayment.withDraw, mapProperty.getBody),
    //   actionHandler(this.paymentController.userBalanceWithdraw, [
    //     mapProperty.getBody,
    //     mapProperty.getUserInfo,
    //   ])
    // );

    // this.router.get(
    //   "/admin-wallet",
    //   actionHandler(this.paymentController.getAddress, mapProperty.getUserInfo)
    // );

    // this.router.post(
    //   "/deposit",
    //   checkPermissions(),
    //   validateSchema(validatePayment.deposit, mapProperty.getBody),
    //   actionHandler(this.paymentController.userBalanceDeposit, [
    //     mapProperty.getBody,
    //     mapProperty.getUserInfo,
    //   ])
    // );
  }
}
