
import { fetchMessageWithPostAndTopic } from "@/app/actions";
import { Message, Post } from "@/types/types";
import { scrollToMessage } from "@/lib/utils";
import { set } from "mongoose";
import Link from "next/link";
import { useEffect, useState } from "react";

interface MessageContentProps {
  messageId: string;
  messages: Message[];
  post: Post;
}

const MessageContent = ({post, messageId, messages }: MessageContentProps) => {

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showDiv, setShowDiv] = useState(false);
  const [divIsLoading, setDivIsLoading] = useState(true);
  const [currentID, setCurrentID] = useState<string>('');
  const [pointedPost, setPointedPost] = useState<any>(null);
  const [topic, setTopic] = useState<string>('');
  const [postId, setPostId] = useState<string>('');
  const [isOp, setIsOp] = useState<boolean>(false);


  useEffect(() => {
    setDivIsLoading(true);
    if(!showDiv || currentID === ''){
      return;
    }
    if(currentID === pointedPost?.id){
      setDivIsLoading(false);
      return;
    }
    const fetchMessage = async () => {
      try {
        const { message, post, topic, error, isOp } = await fetchMessageWithPostAndTopic(currentID);
        if (error) {
          console.log(error);
          return null;
        }
        message.timestamp = (new Date(message.timestamp)).toLocaleString('en-US');
        setPointedPost(message);
        setPostId(post || '');
        setTopic(topic || '');
        setIsOp(isOp || false);
        console.log("isOp", isOp);
        console.log(message, post, topic);
        return message;
      } catch (error) {
        return null;
      } finally {
        setDivIsLoading(false);
      }
    };
  
    fetchMessage();
  }, [currentID, messageId, pointedPost?.id, showDiv]);



  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>, messageId : string) => {
    const x = event.pageX;
    const y = event.pageY;
    setPosition({ x, y });
    setCurrentID(messageId);
    console.log(messageId, postId);
    setShowDiv(true);
  };

  const parseIndepMessage = (message: string) : JSX.Element[] => {
    const parts = message.split(/(>>(\w{24})(\s|$|\n))/g);
    return parts.map((part, index) => {
      const match = part.match(/>>(\w{24})/);
      if (match) {
        return <div key={index} className="block text-blue-500">{">>"}post</div>;
      }
      else if (!part.match(/(\w{24})/)) {
        const match = part.match(/(\w{24})/);
        if (!match) {
          return <span key={index}>{part}</span>;
        }
      }
      return <span key={index}></span>;
    });
  };


  const message = messages.find((msg) => msg._id === messageId);
  
    if (message) {
      const timestamp = message.timestamp = (new Date(message.timestamp)).toLocaleString('en-US');
      return (
        <div onClick={() => scrollToMessage(messageId)} className="relative bg-[#242424] pt-2 pb-2 px-2 rounded-lg flex-col gap-2 py-2 border-t border-gray-600 pl-3 border-l-2 border-gray-600">
          <div className="flex flex-col gap-0 mb-0">
            <p className="font-semibold mb-0">{message.timestamp ? timestamp : 'No timestamp'}</p>
            <div className="mt-0">{parseIndepMessage(message.content)}</div>
          </div>
          <div className="border-l-2 border-gray-600"></div>
        </div>
      );
    }
    else if (messageId === post.message._id) {
      const timestamp = post.timestamp = (new Date(post.timestamp)).toLocaleString('en-US');
      return (
        <div className="block">
        <p
          onClick={() => scrollToMessage(messageId)}
          onMouseMove={(e) => handleMouseMove(e, '')}
          onMouseLeave={() => setShowDiv(false)}
          className="inline-block text-blue-500"
        >
          {">>OP"}
        </p>
        {showDiv && (
          <div
          className="absolute bg-[#242424] p-2 rounded pointer-events-none max-w-[70%]"
          style={{
            top: `${position.y + 10}px`,
            left: `${position.x + 10}px`,
            }}
          >
        <div className="relative bg-[#242424] rounded-lg flex-col gap-2">
        <div className="flex flex-col gap-0 mb-0">
            <p className="font-semibold">OP {post.timestamp ? timestamp : 'No timestamp'}</p>
          </div>
          <div>{parseIndepMessage(post.message.content)}</div>
        <div className=" border-l-2 border-gray-600"></div>
      </div>
      </div>
      )}
      </div>
      );
    }
    else {
      return (
        <div className="block">
        <p
          onMouseMove={(e) => handleMouseMove(e, messageId)}
          onMouseLeave={() => setShowDiv(false)}
          className="inline-block text-blue-500 cursor-default"
        >
          {topic && postId && !pointedPost.deleted.isDeleted ?  (
            <Link href={`/${topic}/${postId}/#${messageId}`}>
              {">>>post"}
            </Link>
          ) : (
            <span>{">>>post"}</span>
          )}
        </p>
        {showDiv ? (
          divIsLoading && pointedPost ? (
            null
          ) : (
            (
              <div
              className="absolute bg-[#242424] p-2 rounded pointer-events-none max-w-[70%] z-10 border border-gray-600"
              style={{
                top: `${position.y + 10}px`,
                left: `${position.x + 10}px`,
                }}
              >
            <div className="relative bg-[#242424] rounded-lg flex-col gap-2">
            <div className="flex flex-col gap-0 mb-0">
                <p className="font-semibold">{isOp ? 'OP' : ''} {pointedPost?.timestamp ? pointedPost.timestamp : 'No timestamp'}</p>
              </div>
              {pointedPost?.content ? <div>{parseIndepMessage(pointedPost.content)} </div> : null}
            <div className=" border-l-2 border-gray-600"></div>
          </div>
          </div>
          )
          )
        ) : null}
      </div>
    );
    }
};

export default MessageContent;