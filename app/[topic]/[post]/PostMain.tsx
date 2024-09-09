'use client';
import { Post as PostType } from '@/lib/types';
import { MessageProvider } from '@/lib/MessageContext';
import { UserProvider } from '@/lib/UserContext';
import Post from './Post';

interface Params {
  post: string;
  topic: string;
}

interface PostMainProps {
  params: Params;
  post: PostType;
  user: string;
}

const PostMain = ({ params, post, user }: PostMainProps) => {

  return (
    <UserProvider>
    <MessageProvider>
    <div className="max-w-7xl mx-auto p-4">
      <Post post={post} topic={params.topic} user={user}></Post>
    </div>
    </MessageProvider>
    </UserProvider>
  );
};

export default PostMain;