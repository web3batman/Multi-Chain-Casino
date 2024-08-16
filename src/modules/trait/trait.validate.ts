import Joi from "joi";

import { validateId } from "@/utils/validations";

export const Id = Joi.custom((value, helper) => validateId(value, helper));

export const main = Joi.object({
  key: Joi.string().required(),
  name: Joi.string().required(),
  value: Joi.string().required(),
});

export const createValidate = main;
