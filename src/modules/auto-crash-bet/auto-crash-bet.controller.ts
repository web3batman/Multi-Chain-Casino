import { FilterQuery } from "mongoose";

import { CustomError } from "@/utils/helpers";
import * as localizations from "@/utils/localizations";
import ILocalization from "@/utils/localizations/localizations.interface";

import { AutoCrashBetService } from ".";
import { IAutoCrashBetModel } from "./auto-crash-bet.interface";

export class AutoCrashBetController {
  // Services
  private autoCrashBetService: AutoCrashBetService;

  // Diff services
  private localizations: ILocalization;

  constructor() {
    this.autoCrashBetService = new AutoCrashBetService();
    this.localizations = localizations["en"];
  }

  public getAll = async () => {
    const autoCrashBetFilter = <FilterQuery<IAutoCrashBetModel>>{};
    const [item, count] = await Promise.all([
      this.autoCrashBetService.get(autoCrashBetFilter),
      this.autoCrashBetService.getCount(autoCrashBetFilter),
    ]);

    return {
      item,
      count,
    };
  };

  public getByName = async (name) => {
    const autoCrashBet = await this.autoCrashBetService.getItem({ name });

    // need add to localizations
    if (!autoCrashBet) {
      throw new CustomError(404, "AutoCrashBet not found");
    }

    return autoCrashBet;
  };

  public getById = async (autoCrashBetId) => {
    const autoCrashBet =
      await this.autoCrashBetService.getItemById(autoCrashBetId);

    // need add to localizations
    if (!autoCrashBet) {
      throw new CustomError(404, "AutoCrashBet not found");
    }

    return autoCrashBet;
  };

  public create = async (autoCrashBet) => {
    try {
      return await this.autoCrashBetService.create(autoCrashBet);
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
      }

      throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
    }
  };

  public update = async ({ id }, autoCrashBetData) => {
    try {
      const autoCrashBet = await this.autoCrashBetService.updateById(
        id,
        autoCrashBetData
      );

      // need add to localizations
      if (!autoCrashBet) {
        throw new CustomError(404, "AutoCrashBet not found");
      }

      return autoCrashBet;
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
      } else if (error.status) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
      }
    }
  };

  public delete = async ({ id }) => {
    const autoCrashBet = await this.autoCrashBetService.deleteById(id);

    // need add to localizations
    if (!autoCrashBet) {
      throw new CustomError(404, "AutoCrashBet not found");
    }

    return autoCrashBet;
  };
}
