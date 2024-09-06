import Link from 'next/link';
import { fetchTopicData } from '../server-actions';
import PostForm from './PostForm';
import { currentUser } from '@clerk/nextjs/server';
import { Post } from '@/types/types';

interface Params {
  topic: string
}

const TopicPage = async ({ params }: { params: Params }) => {
  const response = await fetchTopicData(params.topic);
  const user = await currentUser();

  if (!user) {
    return <div>Error</div>;
  }

  if ('error' in response) {
    console.error('Error fetching topic:', response.error);
    return <div className="text-red-500">Error fetching topic. Please try again later.</div>;
  }

  const topic: any = response;
  if (!topic) return <div className="text-gray-400">Topic does not exist</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 bg-black text-gray-200">
      {/* Form Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">This is the {params.topic} topic</h1>
        <PostForm topic={params.topic} />
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-4 gap-2">
        {topic.posts.length > 0 ? (
          topic.posts.map((post: Post) => (
            <Link key={post.id} href={`/${topic.name}/${post.id}`} passHref>
              <div
                className={`bg-[#2A2A2A] shadow-md rounded-lg p-3 h-40 overflow-hidden ${
                  user.id === post.author ? 'border-t-2 border-blue-500' : ''
                }`}
              >
                <h2 className="text-sm text-gray-200 font-semibold mb-1 truncate">{post.title || 'Untitled'}</h2>
                <p className="text-xs text-gray-300 mb-1 line-clamp-3">{post.message.content}</p>
                <small className="text-xs text-gray-400">Posts: {post.messages.length}</small>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-400 col-span-4">No posts available</p>
        )}
      </div>
    </div>
  );
};

export default TopicPage;