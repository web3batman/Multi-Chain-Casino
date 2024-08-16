// Import Dependencies
import mongoose from "mongoose";

import { IStakingModel } from "./staking.interface";

// Destructure Schema Types
const { Schema } = mongoose;

// Setup User Schema
const StakingSchema = new Schema<IStakingModel>(
  {
    address: { type: String, required: true },
    amount: { type: Number, required: true },
    txAmount: { type: Number },
    txDate: { type: Date, required: true },
    txType: { type: String, required: true },
    txHash: { type: String, required: true, unique: true },
    txStatus: { type: String },
  },
  {
    timestamps: true,
  }
);

// Create and export the new model
const Staking = mongoose.model<IStakingModel>("Staking", StakingSchema);

export default Staking;
