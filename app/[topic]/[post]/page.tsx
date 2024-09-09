import Post from '@/models/post';
import connectDB from '@/lib/mongoose';
import Message from '@/models/message';
import { Message as MessageType, Post as PostType, Reply } from '@/lib/types';
import PostMain from './PostMain';
import React from "react";
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation'

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
      console.log("POST IN POST PAGE", post);
      const messageIds = new Set(post.messages.map(m => m._id.toString()));
      if(post.message && post.message.replies){
        post.message.replies = post.message.replies.filter(reply => messageIds.has(reply._id.toString()));
      }
      post.messages = post.messages.map(message => ({
        ...message,
        replies: message.replies ? message.replies.filter(reply => messageIds.has(reply._id.toString())) : []
      }));
    }
  } catch (error) {

    console.error('Error fetching post:', error);
    redirect('/error');
  }

  if (!post) return <div className="bg-black text-gray-400 p-4">Post does not exist</div>;

  
  
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
  
  
  const data = JSON.parse(JSON.stringify(post));

  return (
    <PostMain params={params} post={data} user={user.id}></PostMain>
  );
};

export default PostPage;
