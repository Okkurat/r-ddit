import { findMessage } from "@/app/actions";
import { useMessageContext } from "@/lib/MessageContext";
import { Message as MessageType, Post, Reply} from '@/lib/types';
import { isElementInViewport, scrollToMessage } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import MessageContent from "./MessageContent";
import BurgerMenu from "@/components/BurgerMenu";
import { useUserValue } from "@/lib/UserContext";
import ReplyForm from "./ReplyForm";

interface RepliesProps {
  messages: MessageType[];
  message: MessageType;
  post: Post;
  isTopLevel?: boolean;
  isOP: boolean;
  topic: string;
}

const Message = ({ post, messages, message, isOP, topic, isTopLevel = true }: RepliesProps) => {

  const user = useUserValue();
  
  const { value, setValue, setIsAllowed, isAllowed } = useMessageContext();
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [replyMessages, setReplyMessages] = useState<MessageType[]>([]);

  const fetchReplyMessage = async (replyId: string) => {
    // handle errors more better here pls
    setIsLoading(true);
    try {
      const { message, error } = await findMessage(replyId);
      if (error) {
        return null;
      }
      message.timestamp = (new Date(message.timestamp)).toLocaleString('en-US');
      message.replies.map((reply: Reply) => {
        reply.timestamp = (new Date(reply.timestamp)).toLocaleString('en-US');
        return reply;
      });
      return message;
    } catch (error) {
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (show && message.replies.length > 0) {
      const fetchReplies = async () => {
        const fetchedReplies = await Promise.all(
          message.replies.map(async (reply: Reply | string) => {
            if (typeof reply === 'string') {
              return await fetchReplyMessage(reply);
            }
            return reply;
          })
        );
        setReplyMessages(fetchedReplies.filter(reply => reply !== null));
      };
      fetchReplies();
    }
  }, [show, message.replies]);

  
  const handleClick = (messageId: string): void => {
    console.log(isAllowed, messageId);
    if(isAllowed === messageId){
      setIsAllowed('');
      setValue('');
      return;
    }
    setIsAllowed(messageId);
    if (value.trim() === '') {
      setValue(`>>${messageId}\n`);
    } else {
      setValue(`${value.trim()}\n>>${messageId}\n`);
    }
  };

  const splitMessageContent = (content: string) => {
    const regex = />>(\w{24})(\s|$|\n)/g;
    const parts = [];
    let lastIndex = 0;

    let match;
    while ((match = regex.exec(content)) !== null) {
      
      parts.push(content.slice(lastIndex, match.index));

      const messageId = match[1];
      parts.push(
        <div key={match.index}>
          <MessageContent post={post} messageId={messageId} messages={messages}></MessageContent>
        </div>
      );

      lastIndex = regex.lastIndex;
    }
    parts.push(content.slice(lastIndex));

    return parts;
  };
  
  if (isOP) {

    return (
      <div id={post.message._id} className="p-2 rounded-lg ml-2">
        <h1 className="text-xl font-semibold mb-2">{post.title}</h1>
        <div className="flex justify-between items-center mb-2 mr-2">
          <h2 className="text-lg font-semibold">Anonymous {post.timestamp ? post.timestamp : 'No timestamp'}</h2>
          {!post.locked && <button onClick={() => handleClick(post.message._id)} className="ml-auto bg-[#242424] text-[#CCCCCC] py-2 px-4 rounded hover:bg-[#3E3F3E]">Reply</button>}
          <BurgerMenu isUser={user===post.author} messageId={post.message._id}></BurgerMenu>
        </div>
        <div>{splitMessageContent(message.content)}</div>
        {post.messages.length > 0 ? (
        <p className="pt-2 text-gray-300">{post.messages.length} messages</p>
        ) : (
          <p className="pt-2 text-gray-300">No messages</p>
        )}
        {isAllowed === message._id && !(isElementInViewport('bottom-reply-form', document)) && <ReplyForm topic={topic} post={post._id} isDefault={false} locked={post.locked?true:false}></ReplyForm>}
      </div>
    );
  }
  
  return (
    <div id={isTopLevel ? message._id : ''} className="bg-[#171717] pl-2 mb-2 pr-2">
      <div className="flex-col gap-4 py-1" key={message._id}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Anonymous {message.timestamp ? message.timestamp : 'No timestamp'}</h2>
          {isTopLevel && !post.locked && <button onClick={() => handleClick(message._id)} className="ml-auto bg-[#242424] text-[#CCCCCC] py-2 px-4 rounded hover:bg-[#3E3F3E]">Reply</button>}
          {isTopLevel && <BurgerMenu isUser={user===message.author} messageId={message._id}></BurgerMenu>}
          {!isTopLevel && <button onClick={() => scrollToMessage(message._id)} className="ml-auto bg-[#242424] text-[#CCCCCC] py-2 px-4 rounded hover:bg-[#3E3F3E]">Move</button>}
        </div>
        <div>{splitMessageContent(message.content)}</div>
        {message.replies.length > 0 && <button onClick={() => setShow(!show)} className="ml-auto bg-[#242424] text-[#CCCCCC] py-2 px-4 rounded hover:bg-[#3E3F3E]">{message.replies.length}</button>}
        <div className="mb-1 pl-4 border-l-2 border-gray-600"></div>
      </div>
      {show && (
        <div className="pl-2 border-l-2 border-gray-600">
          {isLoading ? (
            <p>Loading replies...</p>
          ) : (
            replyMessages.map((reply: MessageType) => {
              return (
                <div key={reply._id} className="border-r-2 border-t-2 border-l-2 mb-1 border-b-2 border-gray-600">
                <Message
                  topic={topic}
                  post={post}
                  messages={messages}
                  message={reply}
                  key={reply._id}
                  isOP={false}
                  isTopLevel={false}
                />
                </div>
              );
            })
          )}
          {isTopLevel && (
            <button
              className="w-full bg-[#242424] text-[#CCCCCC] py-1 px-4 rounded hover:bg-[#3E3F3E]"
              onClick={() => {
                setShow(!show);
                scrollToMessage(message._id);
              }}
            >
              Hide
            </button>
          )}
        </div>
      )}
      {isAllowed === message._id && !(isElementInViewport('bottom-reply-form', document)) && <ReplyForm topic={topic} post={post._id} isDefault={false} locked={post.locked?true:false}></ReplyForm>}
      </div>
      );
};

export default Message;