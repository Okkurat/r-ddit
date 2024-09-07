import { useMessageContext } from "@/context/MessageContext";
import Replies from "./Replies";
import MessageComp from "./MessageComp";
import { Post as PostType, Reply } from "@/types/types";

interface Params {
  post: string;
  topic: string;
}

interface PostMainProps {
  params: Params;
  post: PostType;
}

const Post = ({ params, post }: PostMainProps) => {
  const { value, setValue} = useMessageContext();
  const handleClick = (message_id: string) => {
    if(value.trim() === ''){
      setValue(`>>${message_id}\n`);
    }
    else{
      setValue(`${value}\n>>${message_id}\n`);
    }
  };
  console.log('POST', post);

  return (
    <div className='bg-[#1A1A1A] p-4 rounded-lg'>
    <MessageComp post={post} messages={post.messages} message={post.message} index={0} key={post.message._id} isOP={true}></MessageComp>
    <div className="mb-6 pl-4 border-l-2 border-gray-500">
      <Replies post={post} messages={post.messages}></Replies>
    </div>
  </div>
  );
};

export default Post;