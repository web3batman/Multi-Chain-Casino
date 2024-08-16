import Joi from "joi";

import * as validations from "@/utils/validations";

import { EXAMPLE_ENUM } from "./example.constant";

export const CreateExampleSchema = Joi.object({
  name: Joi.string(),
  type: validations.byEnum(EXAMPLE_ENUM),
});

export const UpdateExampleSchema = Joi.object({
  id: validations.byId,
  name: Joi.string(),
  type: validations.byEnum(EXAMPLE_ENUM),
});
