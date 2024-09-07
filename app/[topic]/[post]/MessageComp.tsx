'use client';
import { findMessage } from "@/app/actions";
import { useMessageContext } from "@/context/MessageContext";
import { Message as MessageType} from "@/types/types";
import React from "react";

interface RepliesProps {
  messages: MessageType[];
  message: MessageType;
  post: any;
  index: number;
  isOP: boolean;
}

const MessageComp = ({ post, messages, message, index, isOP }: RepliesProps) => {

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
        <div className="relative bg-[#2A2A2A] pt-2 pb-2 px-2 rounded-lg flex-col gap-2 py-2 border-t border-gray-600 pl-4 border-l-2 border-gray-600">
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
        <div className="relative bg-[#2A2A2A] pt-2 pb-2 px-2 rounded-lg flex-col gap-2 py-2 border-t border-gray-600 pl-4 border-l-2 border-gray-600">
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
            <a href="#" className="block text-blue-500 hover:text-blue-700">
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
        return <div key={index} className="block text-blue-500 hover:text-blue-700">{">>"}post</div>;
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

  if (isOP) {
    return (
      <>
        <h1 className="text-xl font-semibold mb-2">{post.title}</h1>
        <div className="flex justify-between items-center mb-2">
          <h2 id={post.message._id} className="text-lg font-semibold">1. {post.timestamp}</h2>
          <button onClick={() => handleClick(post.message._id)} className="ml-auto bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800">Reply</button>
        </div>
        <div>{splitMessageContent(message.content)}</div>
        <button className="mb-2 ml-auto bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600">{post.message.replies.length}</button>
      </>
    );
  }
  

  return (
    <div>
      <div className="flex-col gap-4 py-4 border-b border-gray-600" key={message._id}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">{index + 2}. {message.timestamp ? message.timestamp : 'No timestamp'}</h2>
          <button onClick={() => handleClick(message._id)} className="ml-auto bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800">Reply</button>
        </div>
        <div>{splitMessageContent(message.content)}</div>
        <button className="ml-auto bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600">{message.replies.length}</button>
        <div className="mb-1 pl-4 border-l-2 border-gray-600"></div>
      </div>
    </div>
  );
};

export default MessageComp;
