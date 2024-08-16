import Cron, { ScheduleOptions } from "node-cron";

import { BaseCron } from "@/cron/crons/base.cron";
import { CKartTraits } from "@/modules/trait/trait.constant";
import TraitService from "@/modules/trait/trait.service";
import logger from "@/utils/logger";

export class TraitUpdate extends BaseCron {
  private traitService: TraitService;

  constructor(cronExpression: string, option = <ScheduleOptions>{}) {
    super(cronExpression, option);

    this.traitService = new TraitService();
  }

  public start = () => {
    this.initCron();
  };

  private initCron = () => {
    this.task = Cron.schedule(
      this.cronExpression,
      async () => {
        await this.catchWrapper(this.updateTraitStatus, "updateTraitStatus");
      },
      this.option
    );
  };

  private updateTraitStatus = async () => {
    try {
      const kartCurrency = this.traitService.getKartCurrencyWithApi();
      await this.traitService.updateOrInsert(
        {
          key: CKartTraits.getCurrency.key,
          name: CKartTraits.getCurrency.name,
        },
        {
          value: kartCurrency,
          key: CKartTraits.getCurrency.key,
          name: CKartTraits.getCurrency.name,
        }
      );
    } catch (error) {
      logger.error(error);
    }
  };
}
