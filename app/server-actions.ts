import connectDB from "@/lib/mongoose";
import Topic from "@/models/topic";
import Post from "@/models/post";
import Message from "@/models/message";
import { MessageWithoutReplies, TopicSummary, PostPlain } from "@/types/types";
import { currentUser } from "@clerk/nextjs/server";

export async function fetchTopicData(topicName: string): Promise<TopicSummary | { error: string }> {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: 'User does not exist' };
    }

    await connectDB();
    const topic = await Topic.findOne({ name: topicName })
    .populate<TopicSummary>({
      path: 'posts',
      model: Post,
      select: 'title message author messages timestamp latestPost',
      populate: [
        {
          path: 'message',
          model: Message
        },
        {
          path: 'messages',
          model: Message
        }
      ]
    })
    .select('-__v')
    .lean()
    .exec();

    if (!topic) {
      return { error: 'Topic does not exist' };
    }
    console.log("TOPIC", topic);
    const topicSummary: TopicSummary = {
      id: topic._id?.toString(),
      name: topic.name,
      posts: topic.posts.map((post: PostPlain) => ({
        _id: post._id?.toString(),
        title: post.title,
        message: {
          _id: post.message._id,
          content: post.message.content,
          author: post.message.author,
          timestamp: post.message.timestamp
        },
        author: post.author,
        messages: post.messages.map((message: MessageWithoutReplies) => ({
          _id: message._id?.toString(),
          content: message.content,
          author: message.author,
          timestamp: message.timestamp
        })),
        timestamp: post.timestamp,
        latestPost: post.latestPost,
      })),
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