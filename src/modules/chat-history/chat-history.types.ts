import { Types } from "mongoose";

import { TChatUser } from "../user/user.types";

export type IChatEmitHistory = {
  _id: Types.ObjectId;
  message: string;
  sentAt: Date;
  user?: TChatUser;
};
