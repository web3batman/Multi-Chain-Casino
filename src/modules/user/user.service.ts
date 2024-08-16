import bcrypt from "bcryptjs";
import { ObjectId } from "mongoose";

import { SITE_USER_ID } from "@/config";
import BaseService from "@/utils/base/service";
import { User } from "@/utils/db";
import logger from "@/utils/logger";
import { validateFunc } from "@/utils/validations";

import { IUserModel } from "./user.interface";
import * as validateUser from "./user.validate";

export default class UserService extends BaseService<IUserModel> {
  constructor() {
    super(User);
  }

  async create(user: IUserModel) {
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

  async updateUserBalance(
    userId: ObjectId,
    updateParams: string,
    updatefield: number
  ) {
    try {
      await this.update(
        { _id: userId },
        {
          $set: {
            [updateParams]: updatefield,
          },
        }
      );
      const updatedUser = await this.getItemById(userId);

      if (!updatedUser) {
        return "User update Failed";
      }

      return { status: "success", data: updatedUser.wallet };
    } catch (ex) {
      const errorMessage = `Error updating User`;
      logger.error(errorMessage);
      console.error(ex);
      return "User update Failed";
    }
  }

  public async getSiteUserData(): Promise<IUserModel | null> {
    try {
      const result = await this.getItemById(SITE_USER_ID);
      return result;
    } catch (error) {
      logger.error("Error fetching the latest revenue log", error);
      return null;
    }
  }
}
