'use client';
import { Post as PostType } from '@/types/types';
import ReplyForm from './ReplyForm';
import { MessageProvider } from '@/context/MessageContext';
import Post from './Post';

interface Params {
  post: string;
  topic: string;
}

interface PostMainProps {
  params: Params;
  post: PostType;
}

const PostMain = ({ params, post }: PostMainProps) => {

  return (
    <MessageProvider>
    <div>
      <Post params={params} post={post}></Post>
      <ReplyForm topic={params.topic} post={params.post}></ReplyForm>
    </div>
    </MessageProvider>
  );
};

export default PostMain;


/* 
      <div className='bg-[#2A2A2A] p-4 rounded-lg'>
        <h1 className="text-xl font-semibold mb-2">{post.title}</h1>
        <div className="flex justify-between items-center mb-4">
          <h2 id={params.post} className="text-lg font-semibold">1. {new Date(post.timestamp).toLocaleString()}</h2>
          <button className="ml-auto bg-blue-700 text-white py-2 px-4 rounded rounded hover:bg-blue-800">Reply</button>
        </div>
        <p className="mb-6">
          {post.message.content}
        </p>
        <div className="mb-6 pl-4 border-l-2 border-gray-600">
          <Replies messages={post.messages}></Replies>
        </div>
        
      </div>
*/