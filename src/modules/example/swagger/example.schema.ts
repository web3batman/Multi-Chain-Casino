import { EXAMPLE_ENUM } from "../example.constant";

export const exampleSchema = {
  name: { type: "string", required: true },
  type: {
    type: "string",
    enum: EXAMPLE_ENUM,
    default: EXAMPLE_ENUM.EXAMPLE_FIRST,
    required: false,
  },
};

export const fullExampleSchema = {
  type: "object",
  properties: {
    _id: { type: "string", required: true },
    ...exampleSchema,
  },
};
