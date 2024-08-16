import * as AuthConstant from "@/modules/auth/auth.constant";
import { shortUserSchemaWithoutPassword } from "@/modules/user/swagger/user.schema";

const deviceId = {
  name: "deviceId",
  in: "header",
  default: "123",
  required: true,
};

const platform = {
  name: "platform",
  in: "header",
  schema: {
    type: "string",
    enum: Object.keys(AuthConstant.PLATFORM),
  },
  required: true,
  default: AuthConstant.PLATFORM.WEB,
};

const authResponse = {
  type: "object",
  properties: {
    accessToken: { type: "string", required: true },
    refreshToken: { type: "string", required: true },
    expiresIn: { type: "number" },
  },
};

const signUpResponse = {
  type: "object",
  properties: {
    auth: authResponse,
    user: shortUserSchemaWithoutPassword,
  },
};

const signInResponse = {
  type: "object",
  properties: {
    auth: authResponse,
    user: shortUserSchemaWithoutPassword,
  },
};

export const authSchema = {
  authResponse,
  signUpResponse,
  signInResponse,
};

export const deviceParameters = {
  deviceId,
  platform,
};
