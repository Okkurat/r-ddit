import { useMessageContext } from "@/context/MessageContext";
import { Message, Reply } from "@/types/types";
import React from "react";

interface RepliesProps {
  messages: Message[];
  post: any;
}

const Replies = ({ post, messages }: RepliesProps) => {

  const { value, setValue } = useMessageContext();
  const handleClick = (message_id: string) => {
    if (value.trim() === '') {
      setValue(`>>${message_id}\n`);
    } else {
      setValue(`${value}\n>>${message_id}\n`);
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
    console.log("POST", post);
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
    else return (
          <div className="inline text-red-400">
              id couldnt be found
          </div>
    );
  };
  const parseIndepMessage = (message: string) => {
    const regex = />>(\w{24})(\s|$|\n)/g;
  
    const modifiedMessage = message.replace(regex, '>>post$2');
  
    return modifiedMessage;
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
        <React.Fragment key={match.index}>
          {foundMessageJSX}
        </React.Fragment>
      );

      lastIndex = regex.lastIndex;
    }
    parts.push(content.slice(lastIndex));

    return parts;
  };

  const formatReplyIds = (replies: Reply[]) => {
    return replies.map(id => `>>${id}`).join(' ');
  };

  return (
    <div>
      {messages.length > 0 ? (
        messages.map((message: Message, index: number) => (
          <div className="flex-col gap-4 py-4 border-b border-gray-600" key={message._id}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{index + 2}. {message.timestamp ? message.timestamp : 'No timestamp'}</h2>
              <button onClick={() => handleClick(message._id)} className="ml-auto bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800">Reply</button>
            </div>
            <div>{splitMessageContent(message.content)}</div>
            <button className="ml-auto bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600">{message.replies.length}</button>
            <div className="mb-1 pl-4 border-l-2 border-gray-600"></div>
          </div>
        ))
      ) : null}
    </div>
  );
};

export default Replies;
