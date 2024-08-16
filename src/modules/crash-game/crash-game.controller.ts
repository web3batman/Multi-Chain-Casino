import { FilterQuery } from "mongoose";

import { CustomError } from "@/utils/helpers";
import * as localizations from "@/utils/localizations";
import ILocalization from "@/utils/localizations/localizations.interface";

import { CrashGameService, ICrashGameModel } from ".";

export class CrashGameController {
  // Services
  private crashGameService: CrashGameService;

  // Diff services
  private localizations: ILocalization;

  constructor() {
    this.crashGameService = new CrashGameService();

    this.localizations = localizations["en"];
  }

  public getAll = async () => {
    const crashGameFilter = <FilterQuery<ICrashGameModel>>{};
    const [item, count] = await Promise.all([
      this.crashGameService.get(crashGameFilter),
      this.crashGameService.getCount(crashGameFilter),
    ]);

    return {
      item,
      count,
    };
  };

  public getByName = async (name) => {
    const crashGame = await this.crashGameService.getItem({ name });

    // need add to localizations
    if (!crashGame) {
      throw new CustomError(404, "Crash game not found");
    }

    return crashGame;
  };

  public getById = async (crashGameId) => {
    const crashGame = await this.crashGameService.getItemById(crashGameId);

    // need add to localizations
    if (!crashGame) {
      throw new CustomError(404, "Crash game not found");
    }

    return crashGame;
  };

  public create = async (crashGame) => {
    try {
      return await this.crashGameService.create(crashGame);
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
      }

      throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
    }
  };

  public update = async ({ id }, crashGameData) => {
    try {
      const crashGame = await this.crashGameService.updateById(
        id,
        crashGameData
      );

      // need add to localizations
      if (!crashGame) {
        throw new CustomError(404, "Crash game not found");
      }

      return crashGame;
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
    const crashGame = await this.crashGameService.deleteById(id);

    // need add to localizations
    if (!crashGame) {
      throw new CustomError(404, "Crash game not found");
    }

    return crashGame;
  };
}
