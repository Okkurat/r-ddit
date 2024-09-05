'use client';
import { useState, FormEvent, useRef, useEffect } from 'react';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [message]);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium mb-1">
            Select Topic:
          </label>
          <select
            id="topic"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-dark-blue-800 text-gray-700"
          >
            {topics.map((topic) => (
              <option key={topic.name} value={topic.name}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title:
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800 text-gray-700"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message:
          </label>
          <textarea
            id="message"
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800 overflow-hidden text-gray-700"
            style={{ resize: 'none' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 text-white font-semibold rounded-md shadow-sm ${
            loading ? 'bg-gray-400' : 'bg-blue-700 hover:bg-blue-800'
          } focus:outline-none focus:ring-2 focus:ring-blue-800`}
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default CreatePost;