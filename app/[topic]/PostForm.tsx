'use client';
import { FormEvent, useState, useRef, useEffect } from "react";
import { createPost } from "../actions";
import { useRouter } from 'next/navigation';

interface PostFormProps {
  topic: string
}

const PostForm = ({ topic}: PostFormProps) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        topic: { name: topic },
      });
      if (error) {
        setError('User not logged in!');
        return;
      }
      if (savedPost && savedPost.id) {
        router.push(`/${topic}/${savedPost.id}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Unexpected error happened!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
          </label>
          <input
            id="title"
            type="text"
            value={title}
            placeholder="Write your title here..."
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-[#0D0D0D] text-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-blue-800 overflow-hidden"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-[#0D0D0D] text-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-blue-800 overflow-hidden"
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

export default PostForm;
