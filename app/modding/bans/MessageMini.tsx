import { Message } from "@/types/types";
interface MessageMiniProps {
  message: Message;
}

const MessageMini = ({ message } : MessageMiniProps) => {
  return (
    <div className="flex flex-col gap-0 mb-0">
      <p className="font-semibold mb-0">{message.timestamp ? message.timestamp : 'No timestamp'}</p>
      <div className="mt-0">{message.content}</div>
      <div className=" border-l-2 border-gray-600"></div>
    </div>
  );
};

export default MessageMini;