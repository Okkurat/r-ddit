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
    return <div>Error fetching post. Please try again later.</div>;
  }

  if (!post) return <div>Post does not exist</div>;
  return (
    <div>
      <h1>1. {post.title}</h1>
      <p>
        {post.message.content}
      </p>
      <div>
        <Replies messages={post.messages}></Replies>
      </div>
      <ReplyForm topic={params.topic} post={params.post}></ReplyForm>
    </div>
  );
};

export default PostPage;
