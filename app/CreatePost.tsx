'use client';
import { useState, FormEvent, useRef, useEffect } from 'react';
import { createPost } from './actions';
import { TopicType } from '@/lib/types';
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
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="topic" className="block text-sm font-medium mb-1">
          </label>
          <select
            id="topic"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-dark-blue-800 bg-[#0D0D0D] text-[#CCCCCC]"
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
          </label>
          <input
            id="title"
            type="text"
            placeholder="Write your title here..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800 bg-[#0D0D0D] text-[#CCCCCC]"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
          </label>
          <textarea
            id="message"
            ref={textareaRef}
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800 overflow-hidden bg-[#0D0D0D] text-[#CCCCCC]"
            style={{ resize: 'none' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-[#CCCCCC] font-semibold rounded-md shadow-sm ${
            loading ? 'bg-gray-400' : 'bg-[#242424] hover:bg-[#3E3F3E]'
          } focus:outline-none focus:ring-2 hover:bg-[#3E3F3E]`}
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default CreatePost;