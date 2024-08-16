// need add model to mongo index file
import BaseService from "@/utils/base/service";
import { SiteTransaction } from "@/utils/db";

import { ISiteTransactionModel } from "./site-transaction.interface";

export class SiteTransactionService extends BaseService<ISiteTransactionModel> {
  constructor() {
    super(SiteTransaction);
  }
}
