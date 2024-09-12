'use client';
import { createMessage } from "@/app/actions";
import { useMessageContext } from "@/lib/MessageContext";
import { isElementInViewport } from "@/lib/utils";
import { FormEvent, useState, useRef, useEffect, FC } from "react";

interface Params {
  post: string;
  topic: string;
  isDefault: boolean;
  locked: boolean;
}

const ReplyForm: FC<Params> = ({ topic, post, isDefault, locked=false }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const { value, setValue, setIsAllowed, isAllowed } = useMessageContext();

  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
    if (formRef.current && value !== '') {
      formRef.current.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  }, [value]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    if(value.trim() === ''){
      setError('Message cannot be empty');
      setLoading(false);
      return;
    }
    const regex = />>(\w{24})/g;
    const matches = value.match(regex) || [];

    const replies = matches.map(match => match.slice(2));
    try {
      await createMessage({ message: value, topic, post, replies });
      //const { error } = await createMessage({ message: value, topic, post, replies });
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
      setIsAllowed('');
      setLoading(false);
      setValue('');
    }
  };
  if(locked){
    return (
    <div className="bg-[#171717] text-center p-2 rounded border border-[#242424] w-full">
      <p>This post is locked</p>
    </div>
    );
  }
  if(isAllowed !== '' && isDefault && (document.getElementById("bottom-reply-form") || document.getElementById("reply-form")) && !(isElementInViewport('bottom-reply-form', document))){
    return null;
  }
  return (
    <div id={isDefault ? "bottom-reply-form" : "reply-form"} ref={formRef}>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
          </label>
          <textarea
            id="message"
            ref={textareaRef}
            placeholder="Write your message here..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
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

export default ReplyForm;
