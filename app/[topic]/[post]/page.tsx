import Post from '@/models/post';
import Replies from './Replies';
import connectDB from '@/lib/mongoose';
import Message from '@/models/message';

const PostPage = async ({ params }: { params: any }) => {
  let topic: any = null;

  try {
    await connectDB();
    topic = await Post.findById(params.post).populate('message', '', Message).exec();
  } catch (error) {
    console.error('Error fetching post:', error);
    return <div>Error fetching post. Please try again later.</div>;
  }

  if (!topic) return <div>Post does not exist</div>;
  console.log(topic);
  return (
    <div>
      <h1>1. {topic.title}</h1>
      <p>
        {topic.message.content}
      </p>
      <div>
        <Replies messages={topic.messages}></Replies>
      </div>
    </div>
  );
};

export default PostPage;
