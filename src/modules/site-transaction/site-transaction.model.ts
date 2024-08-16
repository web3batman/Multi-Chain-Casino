// Import Dependencies
import mongoose, { model } from "mongoose";

import { ISiteTransactionModel } from "./site-transaction.interface";
const { Schema, SchemaTypes } = mongoose;

// Setup SiteTransaction Schema
const SiteTransactionSchema = new Schema<ISiteTransactionModel>(
  {
    // Amount that was increased or decreased
    amount: Number,
    denom: String,
    // Reason for this wallet transaction
    reason: String,

    // Extra data relating to this transaction
    // game data, crypto transaction data, etc.
    extraData: {
      coinflipGameId: {
        type: SchemaTypes.ObjectId,
        ref: "CoinflipGame",
      },
      crashGameId: {
        type: SchemaTypes.ObjectId,
        ref: "CrashGame",
      },
      transactionId: {
        type: SchemaTypes.ObjectId,
        ref: "CryptoTransaction",
      },
      couponId: {
        type: SchemaTypes.ObjectId,
        ref: "CouponCode",
      },
      affiliatorId: {
        type: SchemaTypes.ObjectId,
        ref: "User",
      },
      modifierId: {
        type: SchemaTypes.ObjectId,
        ref: "User",
      },
      raceId: {
        type: SchemaTypes.ObjectId,
        ref: "Race",
      },
      triviaGameId: {
        type: SchemaTypes.ObjectId,
        ref: "Trivia",
      },
    },

    // What user does this belong to
    userId: {
      type: SchemaTypes.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default model<ISiteTransactionModel>(
  "SiteTransaction",
  SiteTransactionSchema
);
