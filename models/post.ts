import mongoose, { Document, Schema, Model } from 'mongoose';

interface IPost extends Document {
  title: string;
  message: mongoose.Schema.Types.ObjectId;
  author: string;
  messages: mongoose.Schema.Types.ObjectId[];
  timestamp: Date;
  latestPost: Date;
}

const postSchema: Schema<IPost> = new mongoose.Schema({
  title: { type: String, required: false },
  message: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'Message',
  },
  author: { type: String, required: true },
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'Message',
    default: []
  }],
  timestamp: { type: Date, default: Date.now },
  latestPost: { type: Date, default: Date.now }
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
