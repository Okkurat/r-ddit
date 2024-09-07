'use client';
import { createMessage } from "@/app/actions";
import { useMessageContext } from "@/lib/MessageContext";
import { FormEvent, useState, useRef, useEffect, FC } from "react";

interface Params {
  post: string;
  topic: string;
}

const ReplyForm: FC<Params> = ({ topic, post }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const { value, setValue } = useMessageContext();

  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
    if (formRef.current && value !== '') {
      formRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }, [value]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const regex = />>(\w{24})/g;
    const matches = value.match(regex) || [];

    const replies = matches.map(match => match.slice(2));
    try {
      const { error } = await createMessage({ message: value, topic, post, replies });
      if (error) {
        setError(error);
        return;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Unexpected error happened!');
      }
    } finally {
      setLoading(false);
      setValue('');
    }
  };

  return (
    <div ref={formRef}>
      <h2 className="text-2xl font-bold mb-4">Create a New Reply</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message:
          </label>
          <textarea
            id="message"
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 bg-gray-150 overflow-hidden text-gray-700"
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

export default ReplyForm;
