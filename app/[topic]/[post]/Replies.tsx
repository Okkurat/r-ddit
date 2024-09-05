const Replies = (props: any) => {
  console.log(props.messages);
  return (
    <div>
      {props.messages.length > 0 ? (
        props.messages.map((message: any, index: number) => (
          <div key={message._id}>
            <h2>{index + 2} {message.timestamp || 'Untitled'}</h2>
            <p>{message.content}</p>
            {message.replies.length > 0 && (
              <div>
                {message.replies.map((reply: any) => (
                  <div key={reply._id}>
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
