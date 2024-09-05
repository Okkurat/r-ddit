import { Message, Reply } from "@/types/types";

interface RepliesProps {
  messages: Message[]
}

const Replies = ({ messages }: RepliesProps) => {
  console.log(messages);
  return (
    <div>
      {messages.length > 0 ? (
        messages.map((message: Message, index: number) => (
          <div key={message.id}>
            <h2>{index + 2} {message.timestamp || 'Untitled'}</h2>
            <p>{message.content}</p>
            {message.replies.length > 0 && (
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
        <p className="text-gray-500">No posts available</p>
      )}
    </div>
  );
};

export default Replies;
