import Replies from "./Replies";
import Message from "./Message";
import { Post as PostType } from '@/lib/types';
import ReplyForm from "./ReplyForm";
import { useEffect } from "react";
import { useUserSetter } from "@/lib/UserContext";


interface PostMainProps {
  post: PostType;
  topic: string;
  user: string;
}

const Post = ({ post, topic, user }: PostMainProps) => {

  const setValue  = useUserSetter();
  useEffect(() => {
    setValue(user);
  }, [user]);

  return (
    <div className="bg-[#121212] rounded-lg border-2 border-[#242424]">
    <div className="">
    <Message post={post} topic={topic} messages={post.messages} message={post.message} key={post.message._id} isOP={true}></Message>
    </div>
      <div className="bg-[#121212] p-2">
      <Replies topic={topic} post={post} messages={post.messages}></Replies>
      </div>
  </div>
  );
};

export default Post;