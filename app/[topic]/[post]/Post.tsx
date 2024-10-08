import Replies from "./Replies";
import Message from "./Message";
import { Post as PostType } from "@/types/types";
import ReplyForm from "./ReplyForm";
import { useEffect } from "react";
import { useSetIsMod, useUserSetter } from "@/lib/UserContext";

interface PostProps {
  post: PostType;
  topic: string;
  user: string;
  isMod: boolean;
}

const Post = ({ post, topic, user, isMod }: PostProps) => {
  const setValue = useUserSetter();
  const setMod = useSetIsMod();
  useEffect(() => {
    if(isMod) {
      setMod(true);
    }
    setValue(user);
  }, [isMod, setMod, setValue, user]);

  return (
    <div className="bg-[#121212] rounded-lg border-2 border-[#242424]">
    <div className="">
    <Message post={post} topic={topic} messages={post.messages} message={post.message} key={post.message._id} isOP={true}></Message>
    </div>
      <div className="bg-[#121212] p-2">
      <Replies topic={topic} post={post} messages={post.messages}></Replies>
      <ReplyForm topic={topic} post={post._id} isDefault={true} locked={post.locked?true:false}></ReplyForm>
      </div>
  </div>
  );
};

export default Post;