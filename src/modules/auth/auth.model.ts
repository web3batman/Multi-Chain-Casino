import { model, Schema } from "mongoose";

import * as AuthConstant from "./auth.constant";
import { IAuthModel } from "./auth.types";

const AuthSchema = new Schema<IAuthModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deviceId: { type: String },
    platform: {
      type: String,
      enum: Object.keys(AuthConstant.PLATFORM),
      default: AuthConstant.PLATFORM.WEB,
      required: true,
    },
    refreshToken: { type: String, required: false },
  },
  { versionKey: false, timestamps: true }
);

export default model<IAuthModel>("Auth", AuthSchema, "auths");
