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
          <div key={message.id}>
            <h2>{index + 2}. {message.timestamp ? new Date(message.timestamp).toLocaleString() : 'No timestamp'}</h2>
            <p>{message.content}</p>
            {message.replies && message.replies.length > 0 && (
              <div>
                {message.replies.map((reply: Reply) => (
                  <div key={reply.id}>
                    <p>{reply.content || 'No content'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No messages available</p>
      )}
    </div>
  );
};

export default Replies;