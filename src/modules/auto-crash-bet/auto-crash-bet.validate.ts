import Joi from "joi";

import * as validations from "@/utils/validations";

export const CreateExampleSchema = Joi.object({
  name: Joi.string(),
  // type: validations.byEnum(AUTO_CRASH_BET_ENUM),
});

export const UpdateExampleSchema = Joi.object({
  id: validations.byId,
  name: Joi.string(),
  // type: validations.byEnum(EXAMPLE_ENUM),
});
