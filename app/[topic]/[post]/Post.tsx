import Replies from "./Replies";
import MessageComp from "./MessageComp";
import { Post as PostType } from '@/lib/types';

interface PostMainProps {
  post: PostType;
}

const Post = ({ post }: PostMainProps) => {
  return (
    <div className="bg-[#1A1A1A] rounded-lg border-2 border-gray-500">
    <div className="p-2">
    <MessageComp post={post} messages={post.messages} message={post.message} index={0} key={post.message._id} isOP={true}></MessageComp>
    </div>
      <div className="pt-4 pl-4 pr-4">
      <Replies post={post} messages={post.messages}></Replies>
      </div>
  </div>
  );
};

export default Post;