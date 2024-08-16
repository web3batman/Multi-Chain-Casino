import Cron, { ScheduleOptions } from "node-cron";

import { BaseCron } from "@/cron/crons/base.cron";

export class CustomerUpdate extends BaseCron {
  constructor(cronExpression: string, option = <ScheduleOptions>{}) {
    super(cronExpression, option);
  }

  public start = () => {
    this.initCron();
  };

  private initCron = () => {
    this.task = Cron.schedule(
      this.cronExpression,
      async () => {
        await this.catchWrapper(
          this.updateCustomerStatus,
          "updateCustomerStatus"
        );
      },
      this.option
    );
  };

  private updateCustomerStatus = async () => {
    console.log("Start updateCustomerStatus");
  };
}
