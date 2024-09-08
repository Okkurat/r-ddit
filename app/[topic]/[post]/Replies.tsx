import { Message, Post } from '@/lib/types';
import React from "react";
import MessageComp from "./Message";

interface RepliesProps {
  messages: Message[];
  post: Post;
}

const Replies = ({ post, messages }: RepliesProps) => {

  return (
    <div>
      {messages.length > 0 ? (
        messages.map((message: Message, index: number) => (
          <MessageComp post={post} messages={messages} message={message} index={index} key={message._id} isOP={false}></MessageComp>
        ))
      ) : null}
    </div>
  );
};

export default Replies;
