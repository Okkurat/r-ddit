import mongoose, { Document, Schema, Model } from 'mongoose';

interface IMessage extends Document {
  content: string;
  author: string;
  timestamp: Date;
}

const messageSchema: Schema<IMessage> = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message: Model<IMessage> = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
