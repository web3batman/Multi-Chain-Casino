import { ScheduledTask, ScheduleOptions } from "node-cron";

import * as localizations from "@/utils/localizations";
import ILocalization from "@/utils/localizations/localizations.interface";

export class BaseCron {
  protected localizations: ILocalization;
  protected task: ScheduledTask; // Cron need types
  protected readonly option: ScheduleOptions; // Cron need types
  protected cronExpression: string; // Cron need types

  constructor(cronExpression: string, option: ScheduleOptions) {
    this.localizations = localizations["en"];
    this.option = option;
    this.cronExpression = cronExpression;
  }

  public startCron() {
    this.task.start();
  }

  public stopCron() {
    this.task.stop();
  }

  protected async catchWrapper(func, nameFunc = "") {
    const red = "\x1b[31m%s\x1b[0m";
    const green = "\x1b[32m%s\x1b[0m";

    try {
      await func();
      console.log(green, "Done Schedule func: " + nameFunc);
    } catch (error) {
      /*
       * Save error info to mongoDB in cronLog collection
       * time:
       * name:
       * message: error.message
       * */
      console.log(red, error.message);
    }
  }
}
