import mongoose, { Document, Schema, Model } from 'mongoose';

interface ITopic extends Document {
  name: string;
  posts: mongoose.Schema.Types.ObjectId[];
}

const topicSchema: Schema<ITopic> = new mongoose.Schema({
  name: { type: String, required: true },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    default: []
  }]
});

topicSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Topic: Model<ITopic> = mongoose.models.Topic || mongoose.model<ITopic>('Topic', topicSchema);

export default Topic;
