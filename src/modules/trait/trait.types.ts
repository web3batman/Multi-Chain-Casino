import { Document } from "mongoose";

export type TTrait = Pick<ITraitModel, "_id" | "key" | "name" | "value">;

export interface ITraitModel extends Document {
  key: string;
  name: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}
