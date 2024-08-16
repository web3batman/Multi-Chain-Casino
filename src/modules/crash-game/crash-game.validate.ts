import Joi from "joi";

import * as validations from "@/utils/validations";

export const CreateCrashGameSchema = Joi.object({
  name: Joi.string(),
});

export const UpdateCrashGameSchema = Joi.object({
  id: validations.byId,
  name: Joi.string(),
});
