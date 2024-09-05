'use client';

import { useState, FormEvent } from 'react';
import { createPost } from './actions';
import { TopicType } from '@/types/types';
import { useRouter } from 'next/navigation';

interface CreatePostProps {
  topics: TopicType[]  
}

const CreatePost = ({ topics }: CreatePostProps) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>(topics[0]?.name || '');

  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { savedPost, error } = await createPost({
        message,
        title: title || undefined,
        topic: { name: selectedTopic },
      });
      if(error){
        setError(error);
        return;
      }
      if(savedPost && savedPost.id){
        router.push(`/${selectedTopic}/${savedPost.id}`);
      }
    } catch (error: unknown) {
      if(error instanceof Error){
        setError(error.message);
      }
      else {
        setError('Unexpected error happened');
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
      <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
            Select Topic:
          </label>
          <select
            id="topic"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {topics.map((topic) => (
              <option key={topic.name} value={topic.name}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Title:
          </label>
          <input
            id="name"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Message:
          </label>
          <input
            id="name"
            type="text"
            value={message}
            required
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 text-white font-semibold rounded-md shadow-sm ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default CreatePost;
