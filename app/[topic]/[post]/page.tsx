import Post from '@/models/post';
import connectDB from '@/lib/mongoose';
import Message from '@/models/message';
import { Message as MessageType, Post as PostType } from '@/types/types';
import PostMain from './PostMain';
import React from "react";

interface Params {
  post: string;
  topic: string;
}

const PostPage = async ({ params }: { params: Params }) => {
  let post: PostType | null = null;
  try {
    await connectDB();
    post = await Post.findById(params.post)
      .populate<{ message: MessageType }>('message', '', Message)
      .populate<{ messages: MessageType[] }>('messages', '', Message)
      .lean<PostType>()
      .exec();
  } catch (error) {
    console.error('Error fetching post:', error);
    return <div className="bg-black text-red-500 p-4">Error fetching post. Please try again later.</div>;
  }

  if (!post) return <div className="bg-black text-gray-400 p-4">Post does not exist</div>;

  console.log(post);
  post.timestamp = (new Date(post.timestamp)).toLocaleString();
  post.messages.map((message: MessageType) => {
    message.timestamp = (new Date(message.timestamp)).toLocaleString();
    return message;
  });
  
  const data = JSON.parse(JSON.stringify(post))

  return (
    <PostMain params={params} post={data}></PostMain>
  );
};

export default PostPage;
