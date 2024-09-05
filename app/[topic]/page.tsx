import { FC } from 'react';
import Link from 'next/link';
import { fetchTopicData } from '../server-actions';
import { PostSummary, TopicSummary } from '@/types/general';
import PostForm from './PostForm';
import { currentUser } from '@clerk/nextjs/server';

interface TopicPageProps {
  params: {
    topic: string;
  };
}

const TopicPage: FC<TopicPageProps> = async ({ params }) => {
  const response = await fetchTopicData(params.topic);
  const user = await currentUser();
  if(!user){
    return <div>Error</div>;
  }

  if ('error' in response) {
    console.error('Error fetching topic:', response.error);
    return <div className="text-red-500">Error fetching topic. Please try again later.</div>;
  }

  const topic: any = response;

  if (!topic) return <div className="text-gray-500">Topic does not exist</div>
  console.log(topic);

  return (
    <div>
      <PostForm topic={params.topic}></PostForm>
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">This is the {params.topic} topic</h1>
      <div className="flex flex-wrap gap-4">
        {topic.posts.length > 0 ? (
            topic.posts.map((post: any) => (
              <div
                key={post._id}
                className={`bg-white shadow-md rounded-lg p-4 w-full sm:w-1/2 lg:w-1/3 ${
                  user.id === post.author ? 'border-t-4 border-red-500' : ''
                }`}
              >
                <Link href={`/posts/${post._id}`} passHref>
                  <h2 className="text-xl font-semibold mb-2">{post.title || 'Untitled'}</h2>
                  <p className="text-gray-700 mb-2">{post.message.content}</p>
                  <small className="text-gray-500">Posts: {post.messages.length}</small>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No posts available</p>
          )}
      </div>
    </div>
    </div>
  );
};

export default TopicPage;

/*
      <h1 className="text-2xl font-bold mb-4">This is the {params.topic} topic</h1>
      <div className="flex flex-wrap gap-4">
        {topic.posts.length > 0 ? (
          topic.posts.map((post: PostSummary) => (
            <div key={post.id} className="bg-white shadow-md rounded-lg p-4 w-full sm:w-1/2 lg:w-1/3">
              <Link href={`/posts/${post.id}`} passHref>
                <h2 className="text-xl font-semibold mb-2">{post.title || 'Untitled'}</h2>
                <p className="text-gray-700 mb-2">{post.message}</p>
                <small className="text-gray-500">Posts: {post.messagesCount}</small>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No posts available</p>
        )}
      </div>
*/