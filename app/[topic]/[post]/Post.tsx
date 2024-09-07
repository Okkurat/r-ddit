import { useMessageContext } from "@/context/MessageContext";
import Replies from "./Replies";
import MessageComp from "./MessageComp";
import { Post as PostType, Reply } from "@/types/types";

interface Params {
  post: string;
  topic: string;
}

interface PostMainProps {
  post: PostType;
}

const Post = ({ post }: PostMainProps) => {
  return (
    <div className='bg-[#1A1A1A] p-4 rounded-lg'>
    <MessageComp post={post} messages={post.messages} message={post.message} index={0} key={post.message._id} isOP={true}></MessageComp>
    <div className="pl-4 border-l-2 border-gray-500">
      <Replies post={post} messages={post.messages}></Replies>
    </div>
  </div>
  );
};

export default Post;