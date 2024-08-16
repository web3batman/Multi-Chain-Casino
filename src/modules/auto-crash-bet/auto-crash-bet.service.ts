// need add model to mongo index file
import BaseService from "@/utils/base/service";
import { AutoCrashBet } from "@/utils/db";

// need add types
import { IAutoCrashBetModel } from "./auto-crash-bet.interface";

export class AutoCrashBetService extends BaseService<IAutoCrashBetModel> {
  constructor() {
    super(AutoCrashBet);
  }
}
