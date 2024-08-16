import { FilterQuery } from "mongoose";

import { CustomError } from "@/utils/helpers";
import * as localizations from "@/utils/localizations";
import ILocalization from "@/utils/localizations/localizations.interface";

import { LeaderboardController, LeaderboardService } from "../leaderboard";
import TraitController from "../trait/trait.controller";
import { EFilterDate, ERevenueType } from "./dashboard.constant";
import { DashboardService } from "./dashboard.service";
import { TDashboardDocumentType } from "./dashboard.types";

export class DashboardController {
  // Services
  private dashboardService: DashboardService;
  private leaderboard: LeaderboardService;
  private leaderboardController: LeaderboardController;
  private traitController: TraitController;
  // Diff services
  private localizations: ILocalization;

  constructor() {
    this.dashboardService = new DashboardService();
    this.leaderboard = new LeaderboardService();
    this.leaderboardController = new LeaderboardController();
    this.traitController = new TraitController();

    this.localizations = localizations["en"];
  }

  public getAll = async () => {
    const dashboardFilter = <FilterQuery<TDashboardDocumentType>>{};
    const [item, count] = await Promise.all([
      this.dashboardService.get(dashboardFilter),
      this.dashboardService.getCount(dashboardFilter),
    ]);

    return {
      item,
      count,
    };
  };

  public getByName = async (name) => {
    const leaderboard = await this.dashboardService.getItem({ name });

    // need add to localizations
    if (!leaderboard) {
      throw new CustomError(404, "Dashboard not found");
    }

    return leaderboard;
  };

  public getById = async (dashboardId) => {
    const dashboard = await this.dashboardService.getItemById(dashboardId);

    // need add to localizations
    if (!dashboard) {
      throw new CustomError(404, "Dashboard not found");
    }

    return dashboard;
  };

  public create = async (dashboard) => {
    try {
      return await this.dashboardService.create(dashboard);
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
      }

      throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
    }
  };

  public update = async ({ id }, dashboardData) => {
    try {
      const dashboard = await this.dashboardService.updateById(
        id,
        dashboardData
      );

      // need add to localizations
      if (!dashboard) {
        throw new CustomError(404, "Dashboard not found");
      }

      return dashboard;
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
    const dashboard = await this.dashboardService.deleteById(id);

    // need add to localizations
    if (!dashboard) {
      throw new CustomError(404, "Dashboard not found");
    }

    return dashboard;
  };

  public getDashboard = async (query: {
    date: EFilterDate;
    revenueType: ERevenueType;
  }) => {
    const kartCurrency = (await this.traitController.getKartCurrency()).value;
    return await this.dashboardService.getDashboardChart(
      query.date,
      query.revenueType,
      Number(kartCurrency)
    );
  };

  public getTopPlayers = async () => {
    const kartCurrency = (await this.traitController.getKartCurrency()).value;
    return await this.leaderboard.fetchTopPlayers(5, Number(kartCurrency));
  };
}
