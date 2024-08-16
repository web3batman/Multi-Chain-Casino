// Require Dependencies
import mongoose, { model, SchemaTypes } from "mongoose";

import { IAutoCrashBetModel } from "./auto-crash-bet.interface";

// Setup autobet CrashGame Schema
const AutoCrashBetSchema = new mongoose.Schema<IAutoCrashBetModel>(
  {
    // Basic fields
    user: {
      type: SchemaTypes.ObjectId,
      ref: "User",
    },

    // Game Betting Amount
    betAmount: {
      type: Number,
      default: 0,
    },

  

    // Game auto cashout point
    cashoutPoint: {
      type: Number,
      default: 0,
    },

    // Game auto Betting status false = not started, true = started
    status: {
      type: Boolean,
      default: false,
    },

    // remaining Betting number
    count: {
      type: Number,
      default: 0,
    },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

export default model<IAutoCrashBetModel>(
  "AutoCrashBet",
  AutoCrashBetSchema,
  "autoCrashBet"
);
