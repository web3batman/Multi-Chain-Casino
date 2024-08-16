// Import Dependencies
import mongoose, { model, SchemaTypes } from "mongoose";

import { IChatHistoryModel } from "./chat-history.interface";

// Destructure Schema Types
const { Schema } = mongoose;

// Setup Race Schema
const ChatHistorySchema = new Schema<IChatHistoryModel>({
  // Basic fields
  message: String,

  // Sender
  user: {
    type: SchemaTypes.ObjectId,
    ref: "User",
  },

  // When this chat history was created
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<IChatHistoryModel>("ChatHistory", ChatHistorySchema);
