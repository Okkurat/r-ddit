'use client';
import { findMessage } from "@/app/actions";
import { useMessageContext } from "@/context/MessageContext";
import { Message as MessageType} from "@/types/types";
import React, { useState } from "react";

interface RepliesProps {
  messages: MessageType[];
  message: MessageType;
  post: any;
  index: number;
  isOP: boolean;
}

const MessageComp = ({ post, messages, message, index, isOP }: RepliesProps) => {

  const [show, setShow] = useState(false);

  const isElementInViewport = (message_id: string): boolean => {
    const element = document.getElementById(message_id);
    if (element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
    return false;
  };
  

  const scrollToMessage = (message_id: string) => {
    if (!isElementInViewport(message_id)) {
      const element = document.getElementById(message_id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };
  
  const { value, setValue } = useMessageContext();
  const handleClick = (message_id: string) => {
    if (value.trim() === '') {
      setValue(`>>${message_id}\n`);
    } else {
      setValue(`${value.trim()}\n>>${message_id}\n`);
    }
  };

  const findMessageById = (message_id: string) => {
    if (post.message_id === message_id) {
      return (
        <div className="inline bg-white text-black">
          {post.content}
        </div>
      );
    }
  const message = messages.find((msg) => msg._id === message_id);
    if (message) {
      return (
        <div onClick={() => scrollToMessage(message_id)} className="relative bg-[#2A2A2A] pt-2 pb-2 px-2 rounded-lg flex-col gap-2 py-2 border-t border-gray-600 pl-4 border-l-2 border-gray-600">
          <div className="flex flex-col gap-0 mb-0">
            <p className="font-semibold mb-0">{message.timestamp ? message.timestamp : 'No timestamp'}</p>
            <div className="mt-0">{parseIndepMessage(message.content)}</div>
          </div>
          <div className="border-l-2 border-gray-600"></div>
        </div>
      );
    }
    else if (message_id === post.message._id) {
      return (
        <div onClick={() => scrollToMessage(message_id)} className="relative bg-[#2A2A2A] pt-2 pb-2 px-2 rounded-lg flex-col gap-2 py-2 border-t border-gray-600 pl-4 border-l-2 border-gray-600">
        <div className="flex flex-col gap-0 mb-0">
            <p className="font-semibold">{post.timestamp ? post.timestamp : 'No timestamp'}</p>
          </div>
          <div>{parseIndepMessage(post.message.content)}</div>
        <div className=" border-l-2 border-gray-600"></div>
      </div>
      );
    }
    else {
      return (
          <div className="inline text-red-400">
            <a href="#" className="block text-blue-500">
              {">>"}{message_id}
            </a>
          </div>
    );
    }
  };
  const parseIndepMessage = (message: string) => {
    const parts = message.split(/(>>(\w{24})(\s|$|\n))/g);
    return parts.map((part, index) => {
      const match = part.match(/>>(\w{24})/);
      if (match) {
        return <div key={index} className="block text-blue-500">{">>"}post</div>;
      }
      else {
        const match = part.match(/(\w{24})/);
        if (!match) {
          return <span key={index}>{part}</span>;
        }
    }
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
      const foundMessageJSX = findMessageById(message_id);
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

  //console.log(message.replies);
  //console.log(post.message.replies);
  const findMessageIndex = (message_id: string) => {
    const index = post.messages.findIndex((message: any) => message._id === message_id);
    console.log(index); // Debugging
    return index;
  };

  if (isOP) {
    return (
      <div id={post.message._id}>
        <h1 className="text-xl font-semibold mb-2">{post.title}</h1>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">1. {post.timestamp}</h2>
          <button onClick={() => handleClick(post.message._id)} className="ml-auto bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800">Reply</button>
        </div>
        <div>{splitMessageContent(message.content)}</div>
        {message.replies.length > 0 && <button onClick={() => setShow(!show)} className="mb-2 ml-auto bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600">{post.message.replies.length}</button>}
        {show && (
        <div className="pl-4 border-l-2 border-red-500">
        {message.replies.map((reply: any) => {
          const indexInMessages = findMessageIndex(reply._id);
          return (
            <MessageComp
              post={post}
              messages={messages}
              message={reply}
              index={indexInMessages}
              key={reply._id}
              isOP={false}
              />
              );
            })}
            <button className="w-full bg-red-700 text-white py-2 px-4 rounded hover:bg-red-800"
              onClick={() => {
                setShow(!show)
                scrollToMessage(post.message._id)
              }
            }
            >
              Hide
            </button>
        </div>
      )}
      </div>
    );
  }

  return (
    <div id={message._id}>
      <div className="flex-col gap-4 py-4 border-b border-gray-600" key={message._id}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">{index + 2}. {message.timestamp ? message.timestamp : 'No timestamp'}</h2>
          <button onClick={() => handleClick(message._id)} className="ml-auto bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800">Reply</button>
        </div>
        <div>{splitMessageContent(message.content)}</div>
        {message.replies.length > 0 && <button onClick={() => setShow(!show)} className="ml-auto bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600">{message.replies.length}</button>}
        <div className="mb-1 pl-4 border-l-2 border-gray-600"></div>
      </div>
      {show && (
        <div className="pl-4 border-l-2 border-red-500">
        {message.replies.map((reply: any) => {
          const indexInMessages = findMessageIndex(reply._id);
          return (
            <MessageComp
              post={post}
              messages={messages}
              message={reply}
              index={indexInMessages}
              key={reply._id}
              isOP={false}
              />
              );
            })}
            <button className="w-full bg-red-700 text-white py-2 px-4 rounded hover:bg-red-800"
              onClick={() => {
                setShow(!show)
                scrollToMessage(message._id)
              }
            }
            >
              Hide
            </button>
        </div>
      )}
      </div>
      );
    };

export default MessageComp;