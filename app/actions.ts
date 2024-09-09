'use server';

import connectDB from "@/lib/mongoose";
import Message from "@/models/message";
import Post from "@/models/post";
import Topic from "@/models/topic";
import { MessageData, PostData, Post as PostType, TopicType } from '@/lib/types';
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createTopic(prevState: unknown, formData: FormData) {
  try {
    const user = await currentUser();
    if (!user) {
      return { message: 'User does not exist' };
    }
    const schema = z.object({
      name: z.string().min(3, { message: 'Topic must be at least 3 characters long'}),
    });
    const parse = schema.safeParse({
      name: formData.get('name'),
    });
    await connectDB();

    if (!parse.success) {
      return { message: 'Invalid input data' };
    }
    const data = parse.data;
    const newTopic = new Topic({
      name: data.name
    });

    await newTopic.save();
    revalidatePath('/');
    return { message: `Added a new topic ${data.name}` };
  } 
  catch (error) {
    return { 
      message : 'Failed to create topic' 
    };
  }
};

interface MessageProps {
  message: string;
  post: string
  topic: string;
  replies: string[];
}

export async function createMessage(props: MessageProps){
  try {
    const user = await currentUser();
    if (!user) {
      return { error: 'User does not exist' };
    }
    await connectDB();
    const schema = z.object({
      content: z.string().min(1, {message: 'Content must be at least 1 chraracter long'}),
      author: z.string(),
      replies: z.array(z.string()).optional()
    });
    const parse = schema.safeParse({
      content: props.message,
      author: user.id,
      replies: props.replies
    });
    if(!parse.success){
      return { error: 'Invalid input data' };
    }
    const topic = await Topic.findOne({ name: props.topic });
    if (!topic) {
      return { error: 'Topic not found' };
    }
    const newMessageData: MessageData = {
      content: props.message,
      author: user.id
    };
    console.log(props.post);
    const newMessage = new Message(newMessageData);
    const post = await Post.findById(props.post).populate('message', '', Message);
    console.log("HERE");

    if(!post){
      return { error: 'Post not found' };
    }
    console.log(post);
    post.messages.push(newMessage._id as any);
    post.latestPost = newMessage.timestamp;
    await post.save();
    await newMessage.save();

    if (props.replies && props.replies.length > 0) {
      await Message.updateMany(
        { _id: { $in: props.replies } },
        { $push: { replies: newMessage._id } }
      );
    }
    
    revalidatePath(`/${props.topic}/${props.post}`);
    return { 
      newMessage: JSON.parse(JSON.stringify(newMessage))
    };
  
  }
  catch (error: unknown) {
    if(error instanceof Error){
      return { 
        error: error.message || 'Failed to create post' 
      };
    }
    else {
      return { 
        error: 'Unexpecetd error' || 'Failed to create post' 
      };
    }
  }
};

async function deletePost(postId: string) {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: 'User does not exist' };
    }
    const post = await Post.findById(postId).exec();
    if(!post){
      return { error: 'Post not found' };
    }
    if (user.id !== post.author) {
      return { error: 'You are not the author of this post' };
    }
    const topic = await Topic.findOne({ posts: post._id }).exec();
    if (!topic) {
      return { error: 'Topic containing this post not found'};
    }

    await Message.deleteMany({ _id: { $in: post.messages } }).exec();

    await Post.deleteOne({ _id: postId }).exec();
    revalidatePath(`/${topic.name}/${post._id}`);
    revalidatePath(`/${topic.name}`);
    return { 
      success: 'Post and related messages deleted successfully',
    };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          error: error.message || 'Failed to delete post'
        };
      } 
      else {
        return {
          error: 'Unexpected error' || 'Failed to delete post'
        };
      }
    }
}

export async function deleteMessage(messageId: string) {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: 'User does not exist' };
    }
    await connectDB();
    let message = await Message.findById(messageId).exec();
    if (!message) {
      return { error: 'Message not found' };
    }
    if(message.author !== user.id){
      return { error: 'You are not the author of this message' };
    }
    const post = await Post.findOne({ messages: message._id }).exec();
    if(!post){
      console.log("POST IS NOT IN MESSAGES, TRYING TO FIND IN POST");
      const post = await Post.findOne({ message: message._id }).exec();
      if (!post) {
        return { error: 'Post containing this message not found' };
      }
      await deletePost(post.id);
      return { error: 'Post containing this message not found' };
    }
    if (!post) {
      return { error: 'Post containing this message not found' };
    }
    
    const topic = await Topic.findOne({ posts: post._id }).exec();
    if (!topic) {
      return { error: 'Topic containing this post not found'};
    }

    await Message.updateMany(
      { replies: message._id },
      { $pull: { replies: message._id } }
    );
    await Post.updateOne(
      { _id: post._id },
      { $pull: { messages: message._id } }
    );

    message = await Message.findByIdAndDelete(messageId).exec();
    revalidatePath(`/${topic.name}/${post._id}`);
    return {
      success: `Message ${messageId} deleted successfully`,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: error.message || 'Failed to delete message'
      };
    }
    else {
      return {
        error: 'Unexpected error' || 'Failed to delete message'
      };
    }
  }
};

export async function findMessage(messageId: string) {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: 'User does not exist' };
    }
    await connectDB();
    const message = await Message.findById(messageId).populate('replies').lean().exec();
    if (!message) {
      return { error: 'Message not found' };
    }
    return { message: JSON.parse(JSON.stringify(message)) };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { 
        error: error.message || 'Failed to find message' 
      };
    }
    else {
      return { 
        error: 'Unexpected error' || 'Failed to find message' 
      };
    }
  }
};
export async function fetchMessageWithPostAndTopic(messageId: string) {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: 'User does not exist' };
    }
    
    await connectDB();
    
    const message = await Message.findById(messageId).exec();
    if (!message) {
      return { error: 'Message not found' };
    }
    let post;
    post = await Post.findOne({ messages: message._id }).exec();
    if(!post){
      post = await Post.findOne({ message: message._id }).exec();
    }
    if (!post) {
      return { error: 'Post containing this message not found' };
    }
    
    const topic = await Topic.findOne({ posts: post._id }).exec();
    if (!topic) {
      return { error: 'Topic containing this post not found'};
    }
    
    return {
      message: JSON.parse(JSON.stringify(message)),
      post: post.id,
      topic: topic.name, // This will work due to the transformation in your schema
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: error.message || 'Failed to find values'
      };
    } else {
      return {
        error: 'Unexpected error' || 'Failed to find values'
      };
    }
  }
}

interface PostProps {
  title?: string;
  message: string;
  topic: TopicType
}
export async function createPost(props: PostProps) {

  try {
    const user = await currentUser();
    if (!user) {
      return { error: 'User does not exist' };
    }
    await connectDB();

    const schema = z.object({
      content: z.string().min(1, { message: 'Topic must be at least 1 characters long'}),
      author: z.string(),
      title: z.string().optional(),
      topic: z.string()
    });
    const parse = schema.safeParse({
      content: props.message,
      author: user.id,
      title: props.title,
      topic: props.topic.name
    });
    if(!parse.success){
      return { error: 'Invalid input data' };
    }

    const topic = await Topic.findOne({ name: props.topic.name });
    if (!topic) {
      return { error: 'Topic not found' };
    }
    const newMessageData: MessageData = {
      content: props.message,
      author: user.id
    };
    const newMessage = new Message(newMessageData);
    const savedMessage = await newMessage.save();
    const newPostData: PostData = {
      message: savedMessage.id,
      author: user.id,
      title: props.title || savedMessage.content.substring(0, 30)
    };

    const newPost = new Post(newPostData);
    const savedPost = await newPost.save();
    topic.posts.push(savedPost.id);

    revalidatePath(`/${props.topic.name}`);
    await topic.save();
    
    const plainSavedPost = {
      title: savedPost.title,
      message: savedPost.message.toString(),
      id: savedPost.id.toString()
    };

    return { savedPost: plainSavedPost };

  } 
  catch (error: unknown) {
    if(error instanceof Error){
      return { 
        error: error.message || 'Failed to create post' 
      };
    }
    else {
      return { 
        error: 'Unexpecetd error' || 'Failed to create post' 
      };
    }
  }
};