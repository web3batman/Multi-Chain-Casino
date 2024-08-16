import bcrypt from "bcryptjs";
import { FilterQuery, ObjectId } from "mongoose";

import { IAuthInfo } from "@/modules/auth/auth.types";
import { CustomError, getPaginationInfo } from "@/utils/helpers";
import * as localizations from "@/utils/localizations";
import ILocalization from "@/utils/localizations/localizations.interface";

import { ROLE, STATUS } from "./user-bot.constant";
import UserBotService from "./user-bot.service";
import { IUser } from "./user-bot.types";

export default class UserBotController {
  private userBotService: UserBotService;

  private localizations: ILocalization;

  constructor() {
    this.userBotService = new UserBotService();
    this.localizations = localizations["en"];
  }

  editUserForAdmin = async (id: string, user: IUser) => {
    const updatedUser = await this.userBotService.updateById(id, user, {
      password: 0,
    });
    return { status: 200, payload: updatedUser };
  };

  editUser = async (user: IUser, { userId }: IAuthInfo) => {
    let updatedUser;

    try {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }

      updatedUser = await this.userBotService.updateById(userId, user, {
        password: 0,
      });
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.username === 1) {
        throw new CustomError(400, "This username is already registered");
      }

      throw new CustomError(500, "Update user fail");
    }

    return { status: 200, payload: updatedUser };
  };

  setVerifiedUser = (id: ObjectId) => {
    return this.userBotService.updateById(
      id,
      { status: STATUS.VERIFIED },
      { password: 0 }
    );
  };

  getUsers = async ({ offset, limit, text }) => {
    const range = getPaginationInfo(
      { value: offset, default: 0 },
      { value: limit, default: 10 }
    );
    const filter: FilterQuery<IUser> = {};

    if (text) {
      const regexp = new RegExp(text.split(/ +/).join("| ?"), "i");
      filter["$or"] = [{ name: { $regex: regexp } }];
    }

    const [users, count] = await Promise.all([
      this.userBotService.get(filter, {}, range),
      this.userBotService.getCount(filter),
    ]);

    return {
      items: users,
      count,
    };
  };

  getUserByToken = async ({ userId }: IAuthInfo) => {
    const user = this.userBotService.getItemById(userId);
    return { user };
  };

  getUserById = async (id: string, { userId, role }: IAuthInfo, _UTC) => {
    if (role === ROLE.ADMIN && id !== userId.toString()) {
      throw new CustomError(403, this.localizations.ERRORS.OTHER.FORBIDDEN);
    }

    const user = await this.userBotService.getItemById(id, {
      password: 0,
    });

    if (!user) {
      throw new CustomError(404, this.localizations.ERRORS.USER.NOT_EXIST);
    }

    return {
      user: {
        ...user,
      },
    };
  };

  deleteUser = async (id: string) => {
    await this.userBotService.deleteById(id);
    return { status: 204 };
  };

  getPermissions = async () => {
    return {
      roles: Object.keys(ROLE),
      statusArr: Object.keys(STATUS),
    };
  };

  private _diff<T1, T2, T>(a1: Array<T | T1>, a2: Array<T | T2>) {
    return (<Array<T1 | T2>>a1.filter((i) => !a2.includes(<T>i))).concat(
      <Array<T2>>a2.filter((i) => !a1.includes(<T>i))
    );
  }
}
