'use server';

import connectDB from "@/lib/mongoose";
import Message from "@/models/message";
import Post from "@/models/post";
import Topic from "@/models/topic";
import { MessageData, PostData, PostProps } from "@/types/general";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createTopic(prevState: unknown, formData: FormData) {

  try {
    const user = await currentUser();
    console.log(formData.get('name'));
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
      title: props.title
    };

    const newPost = new Post(newPostData);
    const savedPost = await newPost.save();
    topic.posts.push(savedPost.id);

    revalidatePath(`/${props.topic.name}`);
    await topic.save();
    
    return { savedPost: { title: savedPost.title, message: savedPost.message, id: savedPost.id.toString() } };
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
}