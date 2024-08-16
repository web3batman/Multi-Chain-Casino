import { FilterQuery } from "mongoose";

import { CustomError } from "@/utils/helpers";
import * as localizations from "@/utils/localizations";
import ILocalization from "@/utils/localizations/localizations.interface";

import { ISiteTransactionModel } from "./site-transaction.interface";
import { SiteTransactionService } from "./site-transaction.service";

export class SiteTransactionController {
  // Services
  private siteTransactionService: SiteTransactionService;

  // Diff services
  private localizations: ILocalization;

  constructor() {
    this.siteTransactionService = new SiteTransactionService();

    this.localizations = localizations["en"];
  }

  public getAll = async () => {
    const siteTransactionFilter = <FilterQuery<ISiteTransactionModel>>{};
    const [item, count] = await Promise.all([
      this.siteTransactionService.get(siteTransactionFilter),
      this.siteTransactionService.getCount(siteTransactionFilter),
    ]);

    return {
      item,
      count,
    };
  };

  public getByName = async (name) => {
    const siteTransaction = await this.siteTransactionService.getItem({
      name,
    });

    // need add to localizations
    if (!siteTransaction) {
      throw new CustomError(404, "SiteTransaction not found");
    }

    return siteTransaction;
  };

  public getById = async (siteTransactionId) => {
    const siteTransaction =
      await this.siteTransactionService.getItemById(siteTransactionId);

    // need add to localizations
    if (!siteTransaction) {
      throw new CustomError(404, "SiteTransaction not found");
    }

    return siteTransaction;
  };

  public create = async (siteTransaction) => {
    try {
      return await this.siteTransactionService.create(siteTransaction);
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
      }

      throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
    }
  };

  public update = async ({ id }, siteTransactionData) => {
    try {
      const siteTransaction = await this.siteTransactionService.updateById(
        id,
        siteTransactionData
      );

      // need add to localizations
      if (!siteTransaction) {
        throw new CustomError(404, "SiteTransaction not found");
      }

      return siteTransaction;
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
    const siteTransaction = await this.siteTransactionService.deleteById(id);

    // need add to localizations
    if (!siteTransaction) {
      throw new CustomError(404, "SiteTransaction not found");
    }

    return siteTransaction;
  };
}
