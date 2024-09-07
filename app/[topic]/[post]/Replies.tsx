import { useMessageContext } from "@/context/MessageContext";
import { Message } from "@/types/types";
import React from "react";
import MessageComp from "./MessageComp";

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
      setValue(`${value.trim()}\n>>${message_id}\n`);
    }
  };

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
