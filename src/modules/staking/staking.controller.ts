import { FilterQuery } from "mongoose";

import { BigNumber } from "@ethersproject/bignumber";
import { getDayName, getMonthName } from "@/utils/date";
import { CustomError, getPaginationInfo } from "@/utils/helpers";
import * as localizations from "@/utils/localizations";
import ILocalization from "@/utils/localizations/localizations.interface";


import TraitService from "../trait/trait.service";
import { EFilterStakeDate, ETXTYPE } from "./staking.constant";
import { IStakingModel } from "./staking.interface";
import StakingService from "./staking.service";
import { fromHumanString, PaymentService } from "../payment";

export default class StakingController {
  private stakingService: StakingService;
  private traitService: TraitService;
  private paymentService: PaymentService;

  private localizations: ILocalization;

  constructor() {
    this.stakingService = new StakingService();
    this.traitService = new TraitService();
    this.paymentService = new PaymentService();

    this.localizations = localizations["en"];
  }

  public getAll = async () => {
    const stakingFilter = <FilterQuery<IStakingModel>>{};
    const [item, count] = await Promise.all([
      this.stakingService.get(stakingFilter),
      this.stakingService.getCount(stakingFilter),
    ]);

    return {
      item,
      count,
    };
  };

  public getByName = async (name) => {
    const staking = await this.stakingService.getItem({ name });

    // need add to localizations
    if (!staking) {
      throw new CustomError(404, "Staking not found");
    }

    return staking;
  };

  public getById = async (stakingId) => {
    const staking = await this.stakingService.getItemById(stakingId);

    // need add to localizations
    if (!staking) {
      throw new CustomError(404, "Staking not found");
    }

    return staking;
  };

  public create = async (staking) => {
    try {

      if (staking.txType === ETXTYPE.STAKE || staking.txType === ETXTYPE.UNSTAKE) {
        const recentItem = await this.stakingService.aggregateByPipeline([
          {
            $match: {
              address: staking.address,
            },
          },
          {
            $sort: { txDate: -1 },
          },
          {
            $limit: 1,
          },
        ]);
        let txAmount = 0;

        if (recentItem.length > 0) {
          txAmount = recentItem[0]?.txAmount ?? 0;
        }

        staking.txAmount =
          txAmount +
          (staking.txType === ETXTYPE.STAKE ? staking.amount : -staking.amount);

        
      } else {
          staking.txHash
        );
        const txLowLogs: string = txDetails.txResponse?.rawLog;
        const checkDetails = this.paymentService.getTransactionDetails(txLowLogs);
        staking.amount = toHuman(BigNumber.from(checkDetails.amount), 6).toString()
      }

      return await this.stakingService.create(staking);
    } catch (error) {
      console.error(error);

      if (error.code === 11000) {
        throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
      }

      throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
    }
  };

  public update = async ({ id }, stakingData) => {
    try {
      const staking = await this.stakingService.updateById(id, stakingData);

      // need add to localizations
      if (!staking) {
        throw new CustomError(404, "Staking not found");
      }

      return staking;
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
    const staking = await this.stakingService.deleteById(id);

    // need add to localizations
    if (!staking) {
      throw new CustomError(404, "Staking not found");
    }

    return staking;
  };

  public getUserStaking = async ({ offset, limit, address }) => {
    const range = getPaginationInfo(
      { value: offset, default: 0 },
      { value: limit, default: 10 }
    );

    const filter: FilterQuery<IStakingModel> = {
      address,
    };

    const [stakings, count] = await Promise.all([
      this.stakingService.get(
        filter,
        {
          _id: 1,
          txAmount: 1,
          txDate: 1,
          amount: 1,
          txHash: 1,
          txType: 1,
        },
        { skip: range.offset, limit: range.limit }
      ),
      this.stakingService.getCount(filter),
    ]);

    return {
      items: stakings,
      count,
    };
  }

  public stakeHistory = async (query: {
    address: string;
    timeStamp: EFilterStakeDate;
  }) => {
    const today = new Date();
    const diffDays =
      {
        [EFilterStakeDate.week]: 7,
        [EFilterStakeDate.month]: 30,
        [EFilterStakeDate.year]: 365,
      }[query.timeStamp] || 7;

    const fromDay = new Date(today.setDate(today.getDate() - diffDays));
    const stakeHistoryPipeline = [
      {
        $match: {
          address: query.address,
          txDate: {
            $gte: fromDay,
          },
          txType: {
            $in: [ETXTYPE.STAKE, ETXTYPE.UNSTAKE],
          },
        },
      },
      {
        $sort: {
          txDate: -1 as 1 | -1,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$txDate" },
            month: { $month: "$txDate" },
            day:
              query.timeStamp === EFilterStakeDate.year
                ? null
                : { $dayOfMonth: "$txDate" },
          },
          amount: { $first: "$txAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          txDate: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: query.timeStamp === EFilterStakeDate.year ? 1 : "$_id.day",
            },
          },
          amount: 1,
        },
      },
      {
        $sort: {
          txDate: 1 as 1 | -1,
        },
      },
    ];
    const staking =
      await this.stakingService.aggregateByPipeline(stakeHistoryPipeline);

    const recentStakingAmount = await this.stakingService.aggregateByPipeline([
      {
        $match: {
          address: query.address,
          txDate: {
            $lte: fromDay,
          },
          txType: {
            $in: [ETXTYPE.STAKE, ETXTYPE.UNSTAKE],
          },
        },
      },
      {
        $sort: {
          txDate: 1 as 1 | -1,
        },
      },
      {
        $limit: 1,
      },
    ]);

    // need add to localizations
    if (!staking) {
      throw new CustomError(404, "Staking not found");
    }

    const currentDate = new Date();
    const currentDay = new Date().getDate();
    const currentMonth = new Date().getMonth() + 1;

    const tempXData: string[] = [];
    const tempYData: number[] = [];
    const xLength =
      {
        [EFilterStakeDate.week]: 7,
        [EFilterStakeDate.month]: 30,
        [EFilterStakeDate.year]: 12,
      }[query.timeStamp] || 7;

    if (query.timeStamp === EFilterStakeDate.week) {
      let lastKnownAmount = 0;

      for (let i = 0; i < xLength; i++) {
        const date = new Date(currentDate);
        date.setDate(currentDay - (xLength - 1 - i));
        const dayName = getDayName(date.getDay());
        tempXData.push(dayName);

        const tx = staking.find((tx) => {
          const txDate = new Date(tx.txDate);
          return (
            txDate.getDate() === date.getDate() &&
            txDate.getMonth() === date.getMonth() &&
            txDate.getFullYear() === date.getFullYear()
          );
        });

        if (tx) {
          lastKnownAmount = tx.amount;
        }

        if (!tx && i === 0) {
          lastKnownAmount = recentStakingAmount[0]?.txAmount ?? 0;
        }

        tempYData.push(lastKnownAmount);
      }
    } else if (query.timeStamp === EFilterStakeDate.month) {
      let lastKnownAmount = 0;

      for (let i = 0; i < xLength; i += 3) {
        const date = new Date(currentDate);
        date.setDate(currentDay - xLength + 3 + i);
        tempXData.push(
          `${getMonthName(date.getMonth() + 1)}/${String(date.getDate()).padStart(2, "0")}`
        );

        const tx = staking.find((tx) => {
          const txDate = new Date(tx.txDate);
          return (
            txDate.getDate() === date.getDate() &&
            txDate.getMonth() === date.getMonth() &&
            txDate.getFullYear() === date.getFullYear()
          );
        });

        if (tx) {
          lastKnownAmount = tx.amount;
        }

        if (!tx && i === 0) {
          lastKnownAmount = recentStakingAmount[0]?.txAmount ?? 0;
        }

        tempYData.push(lastKnownAmount);
      }
    } else {
      let lastKnownAmount = 0;

      for (let i = 0; i < xLength; i++) {
        tempXData.push(`${getMonthName(currentMonth - xLength + 1 + i)}`);

        const tx = staking.find((tx) => {
          const txDate = new Date(tx.txDate);
          return (
            txDate.getMonth() === currentMonth - xLength + i &&
            txDate.getFullYear() === currentDate.getFullYear()
          );
        });

        if (tx) {
          lastKnownAmount = tx.amount;
        }

        if (!tx && i === 0) {
          lastKnownAmount = recentStakingAmount[0]?.txAmount ?? 0;
        }

        tempYData.push(lastKnownAmount);
      }
    }

    return {
      xData: tempXData,
      yData: tempYData,
    };
  };
}
