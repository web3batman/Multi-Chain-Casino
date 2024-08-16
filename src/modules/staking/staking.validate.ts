import Joi from "joi";

import { validateId } from "@/utils/validations";

import { ETXTYPE } from "./staking.constant";

export const Id = Joi.custom((value, helper) => validateId(value, helper));

export const main = Joi.object({
  address: Joi.string().required(),
  amount: Joi.number().allow(0, null).optional(),
  txDate: Joi.date().required(),
  txHash: Joi.string().required(),
  txType: Joi.string()
    .valid(...Object.keys(ETXTYPE))
    .required(),
});

export const createValidate = main;
