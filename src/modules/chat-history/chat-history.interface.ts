import { Document, ObjectId, Types } from "mongoose";

export interface IChatHistoryModel extends Document {
  _id: Types.ObjectId;
  message: string;
  user: ObjectId;
  sentAt: Date;
}
