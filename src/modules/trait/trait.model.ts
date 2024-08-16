// Import Dependencies
import mongoose from "mongoose";

import { ITraitModel } from "./trait.types";

// Destructure Schema Types
const { Schema } = mongoose;

// Setup User Schema
const TraitSchema = new Schema<ITraitModel>(
  {
    key: { type: String, required: true },
    name: { type: String, required: true },
    value: { type: String },
  },
  {
    timestamps: true,
  }
);

// Create and export the new model
const Trait = mongoose.model<ITraitModel>("Trait", TraitSchema);

export default Trait;
