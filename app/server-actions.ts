import connectDB from "@/lib/mongoose";
import Topic from "@/models/topic";
import Post from "@/models/post";
import Message from "@/models/message";
import { PostSummary, TopicSummary } from "@/types/general";
import { currentUser } from "@clerk/nextjs/server";

export async function fetchTopicData(topicName: string): Promise<any | { error: string }> {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: 'User does not exist' };
    }

    await connectDB();

    const topic = await Topic.findOne({ name: topicName })
    .populate({
      path: 'posts',
      model: Post,
      populate: {
        path: 'message',
        model: Message,
        select: 'content author'
      }
    })
    .lean()
    .exec();
    if (!topic) {
      return { error: 'Topic does not exist' };
    }
    return {
      posts: topic.posts
    }
  } catch (error: any) {
    console.error('Error fetching topic:', error);
    return { error: error.message || 'Failed to fetch topic' };
  }
}