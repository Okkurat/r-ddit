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
    <div className="max-w-7xl mx-auto p-4">
      <Post params={params} post={post}></Post>
      <ReplyForm topic={params.topic} post={params.post}></ReplyForm>
    </div>
    </MessageProvider>
  );
};

export default PostMain;