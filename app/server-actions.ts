import connectDB from "@/lib/mongoose";
import Topic from "@/models/topic";
import Post from "@/models/post";
import Message from "@/models/message";
import { PopulatedPost, PopulatedTopic, TopicSummary } from "@/types/types";
import { currentUser } from "@clerk/nextjs/server";

export async function fetchTopicData(topicName: string): Promise<TopicSummary | { error: string }> {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: 'User does not exist' };
    }

    await connectDB();
    const topic = await Topic.findOne({ name: topicName })
      .populate<PopulatedTopic>({
        path: 'posts',
        model: Post,
        select: 'title message author messages timestamp',
        populate: {
          path: 'message',
          model: Message,
          select: 'content author -_id'
        }
      })
      .select('-__v')
      .lean()
      .exec();

    if (!topic) {
      return { error: 'Topic does not exist' };
    }

    const topicSummary: TopicSummary = {
      id: topic._id.toString(),
      name: topic.name,
      posts: topic.posts.map((post: PopulatedPost) => ({
        id: post._id.toString(),
        title: post.title,
        message: {
          content: post.message.content,
          author: post.message.author
        },
        author: post.author,
        messages: post.messages,
        timestamp: post.timestamp.toISOString()
      }))
    };

    return topicSummary;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching topic:', error);
      return { error: error.message || 'Failed to fetch topic' };
    } else {
      console.error('Unexpected error happened', error);
      return { error: 'Unexpected error happened' || 'Failed to fetch topic' };
    }
  }
}