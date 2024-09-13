import mongoose, { Document, Schema, Model } from 'mongoose';

interface IBan extends Document {
  userId: string;
  reason: string;
  details: string;
  bannedUntil: Date;
  message: mongoose.Schema.Types.ObjectId;
}

const banSchema: Schema<IBan> = new mongoose.Schema({
  userId: { type: String, required: true },
  reason: { type: String, required: true },
  details: { type: String, required: true },
  bannedUntil: { type: Date, required: true },
  message: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'Message'
  },
});

banSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Ban: Model<IBan> = mongoose.models.Ban || mongoose.model<IBan>('Ban', banSchema);

export default Ban;
