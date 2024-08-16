import BaseService from "@/utils/base/service";
import { Staking } from "@/utils/db";

import { IStakingModel } from "./staking.interface";

export default class StakingService extends BaseService<IStakingModel> {
  constructor() {
    super(Staking);
  }
}
