import Link from 'next/link';
import { fetchTopicData } from '../server-actions';
import PostForm from './PostForm';
import { currentUser } from '@clerk/nextjs/server';
import { PostPlain, TopicSummary } from '@/lib/types';
import { redirect } from 'next/navigation'

interface Params {
  topic: string
}

const TopicPage = async ({ params }: { params: Params }) => {
  const user = await currentUser();
  const response = await fetchTopicData(params.topic);


  if (!user) {
    return <div>Error</div>;
  }

  if ('error' in response) {
    console.error('Error fetching topic:', response.error);
    redirect('/error');
  }

  const topic: TopicSummary | null = response;
  if (!topic) return <div className="text-gray-400">Topic does not exist</div>;
  topic.posts.sort((a: PostPlain, b: PostPlain) => {
    return b.latestPost.getTime()- a.latestPost.getTime();
  });
  return (
    <div className="max-w-7xl mx-auto p-4 bg-[#121212] text-[#CCCCCC] rounded-lg border-2 border-[#242424]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">This is the {params.topic} topic</h1>
        <PostForm topic={params.topic} />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {topic.posts.length > 0 ? (
          topic.posts.map((post: PostPlain) => (
            <Link key={post._id} href={`/${topic.name}/${post._id}`} passHref>
              <div
                className={`bg-[#171717] shadow-md rounded-lg p-3 h-40 overflow-hidden ${
                  user.id === post.author ? 'border-t-2 border-blue-500' : ''
                }`}
              >
                <h2 className="text-sm text-[#CCCCCC] font-semibold mb-1 truncate">{post.title || 'Untitled'}</h2>
                <p className="text-xs text-[#CCCCCC] mb-1 line-clamp-3">{post.message.content}</p>
                <small className="text-xs text-gray-300">Posts: {post.messages.length}</small>
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