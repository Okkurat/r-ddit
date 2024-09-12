import Post from '@/models/post';
import connectDB from '@/lib/mongoose';
import Message from '@/models/message';
import { Message as MessageType, Post as PostType, Reply } from "@/types/types";
import PostMain from './PostMain';
import React from "react";
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

interface Params {
  post: string;
  topic: string;
}

const PostPage = async ({ params }: { params: Params }) => {

  const user = await currentUser();
  if (!user) {
    return <div>Error</div>;
  }

  let post: PostType | null = null;
  try {
    await connectDB();
    post = await Post.findById(params.post)
    .populate({
      path: 'message',
      model: Message,
      populate: {
        path: 'replies',
        model: Message
      }
    })
    .populate({
      path: 'messages',
      model: Message,
      populate: {
        path: 'replies',
        model: Message
      }
    })
    .lean<PostType>()
    .exec();
    if(post){
      const messageIds = new Set(post.messages.map(m => m._id.toString()));
      if(post.message && post.message.replies){
        post.message.replies = post.message.replies.filter(reply => messageIds.has(reply._id.toString()));
      }
      post.messages = post.messages.map(message => ({
        ...message,
        replies: message.replies ? message.replies.filter(reply => messageIds.has(reply._id.toString())) : []
      }));
      if (post.message && post.message.replies) {
        post.message.replies = post.message.replies.filter(reply => !reply.deleted?.isDeleted);
      }
      
      if (post.message && post.message.replies) {
        post.message.replies = post.message.replies.filter(reply => !reply.deleted?.isDeleted);
      }
      post.messages = post.messages.filter(message => !message.deleted?.isDeleted).map(message => ({
        ...message,
        replies: message.replies ? message.replies.filter(reply => !reply.deleted?.isDeleted) : []
      }));
      

    }
  } catch (error) {

    console.error('Error fetching post:', error);
    redirect(`/${params.topic}`);
  }

  if (!post || post.message.deleted?.isDeleted) return redirect(`/${params.topic}`);

  const splitMessageContent = async (content: string) => {
    const regex = />>(\w{24})(\s|$|\n)/g;
  
    let match: RegExpExecArray | null;
    let modifiedContent = content;
    while ((match = regex.exec(content)) !== null) {
      try {
        let msg = await Message.findById(match[1]).exec();
        if (msg) {
          if (msg.deleted.isDeleted) {
            console.log("DELETED", msg.id, match[1]);
            modifiedContent = modifiedContent.replace(match[0], '>>DELETED' + match[2]);
          }
        }
      } catch (error) {
        return modifiedContent;
      }
    }
    return modifiedContent;
  };
  const processPost = async () => {
    post.message.content = await splitMessageContent(post.message.content);
    return post;
  };
  await processPost();
  const processMessages = async () => {
    const processedMessages = await Promise.all(
      post.messages.map(async (message) => {
        message.content = await splitMessageContent(message.content);
        return message;
      })
    );
  };
  
  await processMessages();
  
  
  post.timestamp = (new Date(post.timestamp)).toLocaleString();
  post.messages.map((message: MessageType) => {
    message.timestamp = (new Date(message.timestamp)).toLocaleString();
    return message;
  });
  post.message.replies.map((reply: Reply) => {
    reply.timestamp = (new Date(reply.timestamp)).toLocaleString();
    return reply;
  });
  post.messages.map((message: MessageType) => {
    message.replies.map((reply: Reply) => {
      reply.timestamp = (new Date(reply.timestamp)).toLocaleString();
      return reply;
    });
    return message;
  });
  post?.messages.filter(message => message.deleted?.isDeleted);
  
  
  const data = JSON.parse(JSON.stringify(post));
  console.log(data);

  return (
    <PostMain params={params} post={data} user={user.id}></PostMain>
  );
};

export default PostPage;
