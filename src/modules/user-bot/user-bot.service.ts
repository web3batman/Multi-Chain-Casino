import bcrypt from "bcryptjs";
import { ObjectId } from "mongoose";

import BaseService from "@/utils/base/service";
import { UserBot } from "@/utils/db";
import { validateFunc } from "@/utils/validations";

import { IUserBotModel } from "./user-bot.interface";
import * as validateUser from "./user-bot.validate";

export default class UserBotService extends BaseService<IUserBotModel> {
  constructor() {
    super(UserBot);
  }

  async create(user: IUserBotModel) {
    const error = validateFunc(validateUser.full, user);

    if (error) {
      throw new Error(error);
    }

    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    return super.create(user);
  }

  async resetPassword(id: ObjectId, password: string) {
    password = await bcrypt.hash(password, 10);
    return this.updateById(id, { password });
  }
}
