import Joi from "joi";

import { PLATFORM } from "./auth.constant";

export const device = Joi.object({
  deviceId: Joi.string().required().min(3),
  platform: Joi.string().valid(...Object.keys(PLATFORM)),
});

export const signUp = Joi.object({
  username: Joi.string().required().min(2),
  password: Joi.string().required(),
  signAddress: Joi.string().required(),
});

export const walletSignIn = Joi.object({
  wallet: Joi.string().required().min(12),
});

export const signIn = Joi.object({
  username: Joi.string().required().min(2),
  password: Joi.string().required(),
  signAddress: Joi.string().required(),
  signedSig: Joi.object().optional(),
});

export const updateToken = Joi.object({
  refreshToken: Joi.string(),
});

export const resetPassword = Joi.object({
  userId: Joi.string().required(),
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});
