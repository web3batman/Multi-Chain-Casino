// Require Dependencies
import mongoose, { model } from "mongoose";

import { ICrashGameModel } from "./crash-game.interface";

// Setup CrashGame Schema
const CrashGameSchema = new mongoose.Schema<ICrashGameModel>(
  {
    // Basic fields
    crashPoint: Number,
    players: Object,
    refundedPlayers: Array,

    // Provably Fair fields
    privateSeed: String,
    privateHash: String,
    publicSeed: {
      type: String,
      default: null,
    },

    // Game status
    status: {
      type: Number,
      default: 1,
      /**
       * Status list:
       *
       * 1 = Not Started
       * 2 = Starting
       * 3 = In Progress
       * 4 = Over
       * 5 = Blocking
       * 6 = Refunded
       */
    },

    // When game was started
    startedAt: {
      type: Date,
    },
    // When game was started
    userCounts: {
      type: Number,
      default: 0,
    },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

export default model<ICrashGameModel>("CrashGame", CrashGameSchema);
