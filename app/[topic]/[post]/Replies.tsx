import { Message as MessageType, Post } from '@/types/types';
import React from "react";
import Message from "./Message";

interface RepliesProps {
  messages: MessageType[];
  post: Post;
  topic: string;
}

const Replies = ({ post, messages, topic }: RepliesProps) => {

  return (
    <div>
      {messages.length > 0 ? (
        messages.map((message: MessageType) => (
          <Message post={post} topic={topic} messages={messages} message={message} key={message._id} isOP={false} ></Message>
        ))
      ) : null}
    </div>
  );
};

export default Replies;
