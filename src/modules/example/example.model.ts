import { model, Schema } from "mongoose";

import { EXAMPLE_ENUM } from "./example.constant";
import { IExample } from "./example.types";

const ExampleSchema = new Schema<IExample>(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.keys(EXAMPLE_ENUM),
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

export default model<IExample>("Example", ExampleSchema, "examples");
