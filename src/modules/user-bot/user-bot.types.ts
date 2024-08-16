import { Document } from "mongoose";

import { ROLE, STATUS } from "./user-bot.constant";

export interface ISubscriptionPlan {
  startDay: Date;
  endDay: Date;
  isCompleted: boolean;
  inProgress: boolean;
}

export interface IUser extends Document {
  avatar?: string;
  name?: string;
  password?: string;
  phoneNumber?: string;
  socialLinks: Array<{
    type: { type: string };
    link: { type: string };
  }>;
  wallet?: Array<string>;
  role: Array<ROLE>;
  status: STATUS;
  stripeCard?: {
    brand: string;
    exp_month: string;
    exp_year: string;
    last4: string;
    pmId: string;
    holder: string;
  };
}
