import Replies from "./Replies";
import MessageComp from "./Message";
import { Post as PostType } from '@/lib/types';
import ReplyForm from "./ReplyForm";


interface PostMainProps {
  post: PostType;
  topic: string;
}

const Post = ({ post, topic }: PostMainProps) => {
  return (
    <div className="bg-[#121212] rounded-lg border-2 border-[#242424]">
    <div className="">
    <MessageComp post={post} messages={post.messages} message={post.message} index={0} key={post.message._id} isOP={true}></MessageComp>
    </div>
      <div className="bg-[#121212] p-2">
      <Replies post={post} messages={post.messages}></Replies>
      <ReplyForm topic={topic} post={post.title}></ReplyForm>
      </div>
  </div>
  );
};

export default Post;