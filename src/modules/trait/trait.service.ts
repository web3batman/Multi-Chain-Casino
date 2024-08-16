import BaseService from "@/utils/base/service";
import { Trait } from "@/utils/db";

import { ITraitModel } from "./trait.types";

export default class TraitService extends BaseService<ITraitModel> {
  constructor() {
    super(Trait);
  }

  public getKartCurrencyWithApi = async () => {
    try {
      const currentTimestamp = new Date();
      const twoHoursAgoTimestamp = new Date(
        currentTimestamp.getTime() - 2 * 60 * 60 * 1000
      );

      const fetchKartCurrency = await fetch(
        `https://api.kujira.app/api/trades/candles?contract=kujira19n770r9q5haax7mfgy8acrgz7gsamgyjhcvqvxfgrq25983lc42qtszngq&from=${twoHoursAgoTimestamp.toISOString()}&to=${currentTimestamp.toISOString()}&precision=120`
      );
      const kartCurrencyData = await fetchKartCurrency.json();
      const candles = kartCurrencyData.candles;

      if (candles && candles.length > 0) {
        const latestCurrency = candles[candles.length - 1].close;
        return Number(latestCurrency).toFixed(3);
      }
    } catch (error) {
      console.log("error", error);
    }

    return "0.02";
  };
}
