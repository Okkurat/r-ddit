import mongoose, { Document, Schema, Model } from 'mongoose';

interface IPost extends Document {
  title?: string;
  message: string;
  author: string;
  messages: mongoose.Schema.Types.ObjectId[];
  timestamp: Date;
}

const postSchema: Schema<IPost> = new mongoose.Schema({
  title: { type: String, required: false },
  message: { type: String, required: true },
  author: { type: String, required: true },
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  timestamp: { type: Date, default: Date.now }
});

postSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', postSchema);

export default Post;
