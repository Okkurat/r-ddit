'use server';

import connectDB from "@/lib/mongoose";
import Message from "@/models/message";
import Post from "@/models/post";
import Topic from "@/models/topic";
import { NewPostData, PostProps } from "@/types/general";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createTopic(name: string) {

  try {
    const user = await currentUser();
    if (!user) {
      return { error: 'User does not exist' };
    }
    await connectDB();

    if (!name) {
      return { error: 'Invalid input data' };
    }

    const newTopic = new Topic({
      name
    });

    const savedTopic = await newTopic.save();

    return { savedTopic: { name: savedTopic.name, id: savedTopic.id.toString() } };
  } 
  catch (error: any) {
    return { 
      error: error.message || 'Failed to create topic' 
    };
  }
}

export async function createPost(props: PostProps) {

  try {
    const user = await currentUser();
    if (!user) {
      return { error: 'User does not exist' };
    }
    await connectDB();

    if (!props.message) {
      return { error: 'Invalid input data' };
    }

    const topic = await Topic.findOne({ name: props.topic.name });
    if (!topic) {
      return { error: 'Topic not found' };
    }
    const newMessageData: any = {
      content: props.message,
      author: user.id
    };
    const newMessage = new Message(newMessageData);
    const savedMessage = await newMessage.save();
    const newPostData: any = {
      message: savedMessage.id,
      author: user.id,
      title: props.title
    };

    const newPost = new Post(newPostData);
    const savedPost = await newPost.save();
    topic.posts.push(savedPost.id);

    revalidatePath(`/${props.topic.name}`);
    await topic.save();
    

    return { savedPost: { title: savedPost.title, message: savedPost.message, id: savedPost.id.toString() } };
  } 
  catch (error: any) {
    return { 
      error: error.message || 'Failed to create post' 
    };
  }
}