'use client';
import { Post as PostType } from '@/lib/types';
import ReplyForm from './ReplyForm';
import { MessageProvider } from '@/lib/MessageContext';
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
      <Post post={post}></Post>
      <ReplyForm topic={params.topic} post={params.post}></ReplyForm>
    </div>
    </MessageProvider>
  );
};

export default PostMain;