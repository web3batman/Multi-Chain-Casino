import Joi from "joi";

import * as validations from "@/utils/validations";

// import { EXAMPLE_ENUM } from "./payment.constant";

export const CreatePaymentSchema = Joi.object({
  name: Joi.string(),
  // type: validations.byEnum(EXAMPLE_ENUM),
});

export const UpdatePaymentSchema = Joi.object({
  id: validations.byId,
  name: Joi.string(),
  // type: validations.byEnum(EXAMPLE_ENUM),
});

export const withDraw = Joi.object({
  amount: Joi.number().required(),
  currency: Joi.string().required(),
  address: Joi.string().required(),
});

export const deposit = Joi.object({
  amount: Joi.number().required(),
  currency: Joi.string().required(),
  address: Joi.string().required(),
  txHash: Joi.string().required(),
});
