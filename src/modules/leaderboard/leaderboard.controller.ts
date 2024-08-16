import { FilterQuery } from "mongoose";

import { CustomError } from "@/utils/helpers";
import * as localizations from "@/utils/localizations";
import ILocalization from "@/utils/localizations/localizations.interface";

import { LeaderboardService } from "./leaderboard.service";
import { TLeaderboardDocumentType } from "./leaderboard.types";

export class LeaderboardController {
  // Services
  private leaderboardService: LeaderboardService;

  // Diff services
  private localizations: ILocalization;

  constructor() {
    this.leaderboardService = new LeaderboardService();

    this.localizations = localizations["en"];
  }

  public getAll = async () => {
    const leaderboardFilter = <FilterQuery<TLeaderboardDocumentType>>{};
    const [item, count] = await Promise.all([
      this.leaderboardService.get(leaderboardFilter),
      this.leaderboardService.getCount(leaderboardFilter),
    ]);

    return {
      item,
      count,
    };
  };

  public getByName = async (name) => {
    const leaderboard = await this.leaderboardService.getItem({ name });

    // need add to localizations
    if (!leaderboard) {
      throw new CustomError(404, "Leaderboard not found");
    }

    return leaderboard;
  };

  public getById = async (leaderboardId) => {
    const leaderboard =
      await this.leaderboardService.getItemById(leaderboardId);

    // need add to localizations
    if (!leaderboard) {
      throw new CustomError(404, "Leaderboard not found");
    }

    return leaderboard;
  };

  public create = async (leaderboard) => {
    try {
      return await this.leaderboardService.create(leaderboard);
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
      }

      throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
    }
  };

  public update = async ({ id }, leaderboardData) => {
    try {
      const leaderboard = await this.leaderboardService.updateById(
        id,
        leaderboardData
      );

      // need add to localizations
      if (!leaderboard) {
        throw new CustomError(404, "Leaderboard not found");
      }

      return leaderboard;
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
    const leaderboard = await this.leaderboardService.deleteById(id);

    // need add to localizations
    if (!leaderboard) {
      throw new CustomError(404, "Leaderboard not found");
    }

    return leaderboard;
  };
}
