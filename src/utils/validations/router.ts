import Joi from "joi";

import { validateId } from "./validate";

export const byId = Joi.custom((value, helper) => validateId(value, helper));

export const byEnum = (Enum) => Joi.string().valid(...Object.keys(Enum));
export const byEnumValues = (Enum) =>
  Joi.string().valid(...Object.values(Enum));

export const getListValidation = Joi.object({
  text: Joi.string().allow(""),
  offset: Joi.number(),
  limit: Joi.number(),
});
