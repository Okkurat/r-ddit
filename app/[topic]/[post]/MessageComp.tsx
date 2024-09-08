'use client';
import { fetchMessageWithPostAndTopic, findMessage } from "@/app/actions";
import { useMessageContext } from "@/lib/MessageContext";
import { Message as MessageType, Post, Reply} from '@/lib/types';
import { findMessageIndex, isElementInViewport } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface RepliesProps {
  messages: MessageType[];
  message: MessageType;
  post: Post;
  index: number;
  isTopLevel?: boolean;
  isOP: boolean;
}

const MessageComp = ({ post, messages, message, index, isOP, isTopLevel = true }: RepliesProps) => {

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showDiv, setShowDiv] = useState(false);
  const { value, setValue } = useMessageContext();
  const [isLoading, setIsLoading] = useState(false);
  const [divIsLoading, setDivIsLoading] = useState(true);
  const [currentID, setCurrentID] = useState<string>('');
  const [pointedPost, setPointedPost] = useState<any>(null);
  const [topic, setTopic] = useState<string>('');
  const [postId, setPostId] = useState<string>('');
  const [show, setShow] = useState(false);
  const [replyMessages, setReplyMessages] = useState<MessageType[]>([]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>, messageId : string) => {
    const x = event.pageX;
    const y = event.pageY;
    setPosition({ x, y });
    setCurrentID(messageId);
    setShowDiv(true);
  };

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
    setDivIsLoading(true);
    if(!showDiv || currentID === ''){
      return;
    }
    if(currentID === pointedPost?.id){
      setDivIsLoading(false);
      return;
    }
    const fetchMessage = async () => {
      try {
        const { message, post, topic, error } = await fetchMessageWithPostAndTopic(currentID);
        if (error) {
          console.log(error);
          return null;
        }
        message.timestamp = (new Date(message.timestamp)).toLocaleString('en-US');
        setPointedPost(message);
        setPostId(post || '');
        setTopic(topic || '');
        return message;
      } catch (error) {
        return null;
      } finally {
        setDivIsLoading(false);
      }
    };
  
    fetchMessage();
  }, [currentID, pointedPost?.id, showDiv]);

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
  
  const scrollToMessage = (message_id: string): void => {
    if (!isElementInViewport(message_id, document)) {
      const element = document.getElementById(message_id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };
  
  
  const handleClick = (message_id: string): void => {
    if (value.trim() === '') {
      setValue(`>>${message_id}\n`);
    } else {
      setValue(`${value.trim()}\n>>${message_id}\n`);
    }
  };

  const messageContent = (message_id: string): JSX.Element => {
    const message = messages.find((msg) => msg._id === message_id);
      if (message) {
        const timestamp = message.timestamp = (new Date(message.timestamp)).toLocaleString('en-US');
        return (
          <div onClick={() => scrollToMessage(message_id)} className="relative bg-[#242424] pt-2 pb-2 px-2 rounded-lg flex-col gap-2 py-2 border-t border-gray-600 pl-3 border-l-2 border-gray-600">
            <div className="flex flex-col gap-0 mb-0">
              <p className="font-semibold mb-0">{message.timestamp ? timestamp : 'No timestamp'}</p>
              <div className="mt-0">{parseIndepMessage(message.content)}</div>
            </div>
            <div className="border-l-2 border-gray-600"></div>
          </div>
        );
      }
      else if (message_id === post.message._id) {
        const timestamp = post.timestamp = (new Date(post.timestamp)).toLocaleString('en-US');
        return (
          <div className="block">
          <p
            onClick={() => scrollToMessage(message_id)}
            onMouseMove={(e) => handleMouseMove(e, '')}
            onMouseLeave={() => setShowDiv(false)}
            className="inline-block text-blue-500"
          >
            {">>OP"}
          </p>
          {showDiv && (
            <div
            className="absolute bg-[#242424] p-2 rounded pointer-events-none max-w-[70%]"
            style={{
              top: `${position.y + 10}px`,
              left: `${position.x + 10}px`,
              }}
            >
          <div className="relative bg-[#242424] rounded-lg flex-col gap-2">
          <div className="flex flex-col gap-0 mb-0">
              <p className="font-semibold">1. {post.timestamp ? timestamp : 'No timestamp'}</p>
            </div>
            <div>{parseIndepMessage(post.message.content)}</div>
          <div className=" border-l-2 border-gray-600"></div>
        </div>
        </div>
        )}
        </div>
        );
      }
      else {
        return (
          <div className="block">
          <p
            onMouseMove={(e) => handleMouseMove(e, message_id)}
            onMouseLeave={() => setShowDiv(false)}
            className="inline-block text-blue-500 cursor-default"
          >
            {topic && postId ? (
              <Link href={`/${topic}/${postId}/#${message_id}`}>
                {">>>post"}
              </Link>
            ) : (
              <span>{">>>post"}</span>
            )}
          </p>
          {showDiv ? (
            divIsLoading && pointedPost ? (
              null
            ) : (
              (
                <div
                className="absolute bg-[#242424] p-2 rounded pointer-events-none max-w-[70%]"
                style={{
                  top: `${position.y + 10}px`,
                  left: `${position.x + 10}px`,
                  }}
                >
              <div className="relative bg-[#242424] rounded-lg flex-col gap-2">
              <div className="flex flex-col gap-0 mb-0">
                  <p className="font-semibold">1. {pointedPost?.timestamp ? pointedPost.timestamp : 'No timestamp'}</p>
                </div>
                {pointedPost?.content ? <div>{parseIndepMessage(pointedPost.content)} </div> : null}
              <div className=" border-l-2 border-gray-600"></div>
            </div>
            </div>
            )
            )
          ) : null}
        </div>
      );
      }
  };
  const parseIndepMessage = (message: string) : JSX.Element[] => {
    const parts = message.split(/(>>(\w{24})(\s|$|\n))/g);
    return parts.map((part, index) => {
      const match = part.match(/>>(\w{24})/);
      if (match) {
        return <div key={index} className="block text-blue-500">{">>"}post</div>;
      }
      else if (!part.match(/(\w{24})/)) {
        const match = part.match(/(\w{24})/);
        if (!match) {
          return <span key={index}>{part}</span>;
        }
      }
      return <span key={index}></span>;
    });
  };

  const splitMessageContent = (content: string) => {
    const regex = />>(\w{24})(\s|$|\n)/g;
    const parts = [];
    let lastIndex = 0;

    let match;
    while ((match = regex.exec(content)) !== null) {
      parts.push(content.slice(lastIndex, match.index));

      const message_id = match[1];
      const foundMessageJSX = messageContent(message_id);
      parts.push(
        <div key={match.index}>
          {foundMessageJSX}
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
          <h2 className="text-lg font-semibold">1. {post.timestamp ? post.timestamp : 'No timestamp'}</h2>
          <button onClick={() => handleClick(post.message._id)} className="ml-auto bg-[#242424] text-[#CCCCCC] py-2 px-4 rounded hover:bg-[#3E3F3E]">Reply</button>
        </div>
        <div>{splitMessageContent(message.content)}</div>
        {message.replies.length > 0 ? (
        <p className="pt-2 text-gray-300">{post.message.replies.length} messages</p>
        ) : (
          <p className="pt-2 text-gray-300">No messages</p>
        )}
      </div>
    );
  }
  
  return (
    <div id={message._id} className="bg-[#171717] pl-2 mb-2 pr-2">
      <div className="flex-col gap-4 py-1" key={message._id}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">{index + 2}. {message.timestamp ? message.timestamp : 'No timestamp'}</h2>
          <button onClick={() => handleClick(message._id)} className="ml-auto bg-[#242424] text-[#CCCCCC] py-2 px-4 rounded hover:bg-[#3E3F3E]">Reply</button>
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
              const indexInMessages = findMessageIndex(reply._id, post);
              return (
                <div className="border-r-2 border-t-2 border-l-2 mb-1 border-b-2 border-gray-600">
                <MessageComp
                  post={post}
                  messages={messages}
                  message={reply}
                  index={indexInMessages}
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
      </div>
      );
};

export default MessageComp;