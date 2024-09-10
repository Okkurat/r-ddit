import mongoose, { Document, Schema, Model } from 'mongoose';

interface IReport extends Document {
  reportDetails: string;
  reportReason: string;
  author: string;
  message: string;
  timestamp: Date;
  post: string;
  topic: string;
}

const reportSchema: Schema<IReport> = new mongoose.Schema({
  reportDetails: { type: String, required: true },
  reportReason: { type: String, required: true },
  author: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  post: { type: String, required: true },
  topic: { type: String, required: true },
  message: { type: String, required: true },
});

reportSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Report: Model<IReport> = mongoose.models.Report || mongoose.model<IReport>('Report', reportSchema);

export default Report;
