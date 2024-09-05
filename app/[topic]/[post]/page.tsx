import Post from '@/models/post';
import Replies from './Replies';
import connectDB from '@/lib/mongoose';
import Message from '@/models/message';
import { Message as MessageType, Post as PostType } from '@/types/types';
import ReplyForm from './ReplyForm';

interface Params {
  post: string;
  topic: string;
}

const PostPage = async ({ params }: { params: Params }) => {
  let post: PostType | null = null;
  try {
    await connectDB();
    post = await Post.findById(params.post)
      .populate<{ message: MessageType }>('message', '', Message)
      .populate<{ messages: MessageType[] }>('messages', '', Message)
      .lean<PostType>()
      .exec();
  } catch (error) {
    console.error('Error fetching post:', error);
    return <div className="bg-black text-red-500 p-4">Error fetching post. Please try again later.</div>;
  }

  if (!post) return <div className="bg-black text-gray-400 p-4">Post does not exist</div>;

  console.log(post);

  return (
    <div>
      <div className='bg-[#2A2A2A] p-4 rounded-lg'>
      <h1 className="text-xl font-semibold mb-2">{post.title}</h1>
      <h2 id={params.post} className="text-lg font-semibold mb-4">1. {post.timestamp.toLocaleString()}</h2>
      <p className="mb-6">
        {post.message.content}
      </p>
      <div className="mb-6 pl-4 border-l-2 border-gray-600">
        <Replies messages={post.messages}></Replies>
      </div>
      </div>
      <ReplyForm topic={params.topic} post={params.post}></ReplyForm>
    </div>
  );
};

export default PostPage;