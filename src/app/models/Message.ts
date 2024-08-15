import mongoose, { Document, Model, Schema } from "mongoose";

interface IMessage extends Document {
  sender: mongoose.Schema.Types.ObjectId;
  receiver: mongoose.Schema.Types.ObjectId;
  messageText: string;
  timestamp?: Date;
}

const MessageSchema: Schema<IMessage> = new mongoose.Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
  messageText: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
