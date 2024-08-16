import Joi from "joi";

import { validateId } from "@/utils/validations";

import { ROLE, STATUS } from "./user-bot.constant";

export const Id = Joi.custom((value, helper) => validateId(value, helper));

export const main = Joi.object({
  avatar: Joi.string().allow("").optional(),
  name: Joi.string().allow("").optional(),
  password: Joi.string().allow("").optional(),
  phoneNumber: Joi.string().allow("").optional(),
  wallet: Joi.array().items(Joi.string()).optional(),
  socialLinks: Joi.array().optional(),
  role: Joi.string().allow("").optional(),
  status: Joi.string().allow("").optional(),
});

export const addition = Joi.object({
  avatar: Joi.string().allow("").optional(),
  name: Joi.string().allow("").optional(),
  password: Joi.string().allow("").optional(),
  phoneNumber: Joi.string().allow("").optional(),
  wallet: Joi.array().items(Joi.string()).optional(),
  socialLinks: Joi.array().optional(),
  role: Joi.string().allow("").optional(),
  stripeCard: Joi.object().optional(),
});

export const additionAdmin = Joi.object({
  avatar: Joi.string(),
  name: Joi.string(),
  status: Joi.string().valid(...Object.keys(STATUS)),
  role: Joi.string().valid(...Object.keys(ROLE)),
  wallet: Joi.array().items(Joi.string()),
});

export const full = Joi.object().concat(main).concat(addition);
