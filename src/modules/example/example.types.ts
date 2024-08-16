import { Document, SchemaTimestampsConfig } from "mongoose";

import { EXAMPLE_ENUM } from "./";

export interface IExampleObject {
  name: string;
  type: EXAMPLE_ENUM;
}

export interface IExample
  extends IExampleObject,
    Document,
    SchemaTimestampsConfig {}
