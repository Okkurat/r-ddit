import mongoose, { Document, Schema, Model } from 'mongoose';

interface IMessage extends Document {
  content: string;
  author: string;
  timestamp: Date;
  replies: mongoose.Schema.Types.ObjectId[];
  deleted: {
    timestamp?: Date;
    isDeleted: boolean;
  };
  markAsDeleted: () => void;
}

const messageSchema: Schema<IMessage> = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'Message',
    default: []
  }],
  deleted: {
    timestamp: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
  }
});

messageSchema.methods.markAsDeleted = function () {
  this.deleted.timestamp = new Date();
  this.deleted.isDeleted = true;
  return this.save();
};

messageSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);

export default Message;
