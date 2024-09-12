'use server';

import connectDB from "@/lib/mongoose";
import Message from "@/models/message";
import Post from "@/models/post";
import Topic from "@/models/topic";
import Report from "@/models/report";
import { MessageData, PostData, TopicType, ReportData, Message as MessageType } from "@/types/types";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createReport(reportDetails: string, reportReason: string, messageId: string) {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: 'User does not exist' };
    }
    await connectDB();
    const schema = z.object({
      reportDetails: z.string(),
      messageId: z.string(),
      reportReason: z.string()
    });
    const parse = schema.safeParse({
      reportDetails,
      reportReason,
      messageId,
    });
    if(!parse.success){
      return { error: 'Invalid input data' };
    }
    const message = await Message.findById(messageId).exec();
    if (!message) {
      return { error: 'Message not found' };
    }

    let post = await Post.findOne({ messages: messageId }).exec();
    if(!post){
      post = await Post.findOne({ message: messageId }).exec();
      if (!post) {
        return { error: 'Post containing this message not found' };
      }
    }
    const topic = await Topic.findOne({ posts: post._id }).exec();
    if (!topic) {
      return { error: 'Topic containing this post not found'};
    }

    const reportData: ReportData = {
      reportDetails: reportDetails,
      reportReason: reportReason,
      author: message.author,
      message: messageId,
      topic: topic.name,
      post: post.id.toString(),
    };
    const newReport = new Report(reportData);
    await newReport.save();
    revalidatePath('/modding/reports');
    return { success: 'Report created' };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: error.message || 'Failed to create report'
      };
    } else {
      return {
        error: 'Unexpected error' || 'Failed to create report'
      };
    }
  }
}

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

    const post: any = await Post.findById(props.post)
    .populate('message', '', Message)
    .populate('messages', '', Message);
    if(!post){
      return { error: 'Post not found' };
    }
    console.log("POST", post);
    console.log("POST MESSAGE",post.message);
    console.log("POST MESSAGE AUTHOR", post.message.author);
    console.log("POST MESSAGES", post.messages);
    let userId = 0;
    if(post.message.author !== user.id){
      const uniqueMessages = new Set(post.messages.map((message: MessageType) => message.author));
      if(uniqueMessages.has(user.id)){
        userId = post.messages.find((message: MessageType) => message.author === user.id).userId;
      }
      else {
        userId = post.uniques + 1;
        post.uniques += 1;
      }
      console.log("POST Uniques", post.uniques);
      console.log("HERE", uniqueMessages);
      console.log("USERID", userId);
    }
    const newMessageData: MessageData = {
      content: props.message,
      author: user.id,
      userId
    };
    console.log(props.post);
    const newMessage = new Message(newMessageData);

    if(!post){
      return { error: 'Post not found' };
    }
    console.log(post);
    if(post.locked){
      return { error: 'Post is locked' };
    }
    post.messages.push(newMessage.id as any);
    post.latestPost = newMessage.timestamp;
    let count = 0;
    for (const message of post.messages) {
      const msg = await Message.findById(message._id.toString()).lean().exec();
      if (!msg?.deleted?.isDeleted) {
        count++;
        console.log(count);
      }
      if (count === 100) {
        post.locked = true;
        break;
      }
    }
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
    let post = await Post.findOne({ messages: message._id }).exec();
    if(!post){
      console.log("POST IS NOT IN MESSAGES, TRYING TO FIND IN POST");
      post = await Post.findOne({ message: message._id }).exec();
      if (!post) {
        return { error: 'Post containing this message not found' };
      }
    }
    
    const topic = await Topic.findOne({ posts: post._id }).exec();
    if (!topic) {
      return { error: 'Topic containing this post not found'};
    }
    message.markAsDeleted();
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
    let isOp = false;
    
    const message = await Message.findById(messageId).exec();
    if (!message) {
      return { error: 'Message not found' };
    }
    let post;
    post = await Post.findOne({ messages: message._id }).exec();
    if(!post){
      post = await Post.findOne({ message: message._id }).exec();
      isOp = true;
    }
    if (!post) {
      return { error: 'Post containing this message not found' };
    }
    
    const topic = await Topic.findOne({ posts: post._id }).exec();
    if (!topic) {
      return { error: 'Topic containing this post not found'};
    }
    console.log(post);
    
    return {
      message: JSON.parse(JSON.stringify(message)),
      post: post.id,
      isOp: isOp,
      topic: topic.name,
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
      author: user.id,
      userId: 0,
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