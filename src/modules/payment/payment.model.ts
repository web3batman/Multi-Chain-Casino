// Import Dependencies
import mongoose, { model } from "mongoose";

import { IPaymentModel } from "./payment.interface";

// Destructure Schema Types
const { Schema } = mongoose;

// Setup Payment Schema
const PaymentSchema = new Schema<IPaymentModel>(
  {
    // Authentication related fields
    userId: { type: String },
    walletAddress: { type: String },
    type: { type: String },
    denom: { type: String },
    amount: { type: Number },
    txHash: { type: String },
  },
  {
    timestamps: true,
  }
);

export default model<IPaymentModel>("Payment", PaymentSchema);
