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
            <h2 className="text-xl font-semibold">{index + 2}. {message.timestamp ? new Date(message.timestamp).toLocaleString() : 'No timestamp'}</h2>
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
      ) : null}
    </div>
  );
};

export default Replies;