import { Message } from "@/types/types";

interface RepliesProps {
  messages: Message[]
}

interface Reply {
  id: string;
  content: string;
}
const Replies = ({ messages }: RepliesProps) => {
  console.log("MESSAGES", messages);
  return (
    <div>
      {messages.length > 0 ? (
        messages.map((message: Message, index: number) => (
          
          <div className="flex-col gap-4 py-4 border-b border-gray-600" key={message._id}>
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{index + 2}. {message.timestamp ? new Date(message.timestamp).toLocaleString() : 'No timestamp'}</h2>
            <button className="ml-auto bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800">Reply</button>
            </div>
            <p>{message.content}</p>
          </div>
        ))
      ) : null}
    </div>
  );
};

export default Replies;