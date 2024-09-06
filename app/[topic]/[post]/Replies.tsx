import { useMessageContext } from "@/context/MessageContext";
import { Message, Reply } from "@/types/types";

interface RepliesProps {
  messages: Message[]
}

const Replies = ({ messages }: RepliesProps) => {
  const { value, setValue} = useMessageContext();
  const handleClick = (message_id: string) => {
    if(value.trim() === ''){
      setValue(`>>${message_id}\n`);
    }
    else{
      setValue(`${value}\n>>${message_id}\n`);
    }
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
            <p>{message.content}</p>
            <p className="text-blue-400">{formatReplyIds(message.replies)}</p>
          </div>
        ))
      ) : null}
    </div>
  );
};

export default Replies;