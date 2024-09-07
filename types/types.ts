export interface TopicType {
  name: string
}
export interface NewPostData {
  message: string;
  author: string;
  title?: string;
}

export interface Reply {
  _id: string;
  content: string
  timestamp: string;
  author: string;
  replies: Reply[];
}

export interface PostData {
  message: string;
  author: string;
  title: string;
}
export interface MessageData {
  content: string;
  author: string;
}

export interface Post {
  _id: string;
  title: string;
  message: Message;
  author: string;
  messages: Message[]
  timestamp: string;
  latestPost: Date;
}
export interface PostPlain {
  _id: string;
  title: string;
  message: MessageWithoutReplies;
  author: string;
  messages: MessageWithoutReplies[];
  timestamp: string;
  latestPost: Date;
}
export interface TopicSummary {
  id: string;
  name: string;
  posts: PostPlain[];
}

export interface Message {
  _id: string;
  content: string;
  author: string;
  timestamp: string;
  replies: Reply[];
}

export type MessageWithoutReplies = Omit<Message, 'replies'>;