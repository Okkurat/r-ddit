import { useMessageContext } from "@/context/MessageContext";
import Replies from "./Replies";

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

  const formatReplyIds = (replies: Reply[]) => {
    return replies.map(id => `>>${id}`).join(' ');
  };
  return (
    <div className='bg-[#1A1A1A] p-4 rounded-lg'>
    <h1 className="text-xl font-semibold mb-2">{post.title}</h1>
    <div className="flex justify-between items-center mb-2">
      <h2 id={post.message._id} className="text-lg font-semibold">1. {post.timestamp}</h2>
      <button onClick={() => handleClick(post.message._id)} className="ml-auto bg-blue-700 text-white py-2 px-4 rounded rounded hover:bg-blue-800">Reply</button>
    </div>
    <p className="mb-3">
      {post.message.content}
    </p>
    <button className="mb-2 ml-auto bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600">{post.message.replies.length}</button>
    <div className="mb-6 pl-4 border-l-2 border-gray-500">
      <Replies post={post} messages={post.messages}></Replies>
    </div>
  </div>
  );
};

export default Post;