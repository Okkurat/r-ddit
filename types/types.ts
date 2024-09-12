export interface TopicType {
  name: string
}
export interface NewPostData {
  message: string;
  author: string;
  title: string;
}

export interface Reply {
  _id: string;
  content: string
  timestamp: string;
  author: string;
  replies: Reply[];
  deleted?: {
    timestamp?: Date;
    isDeleted?: boolean;
  };
}

export interface PostData {
  message: string;
  author: string;
  title: string;
}
export interface MessageData {
  content: string;
  author: string;
  userId: number;
}
export interface ReportData {
  reportDetails: string;
  reportReason: string;
  message: string;
  author: string
  topic: string;
  post: string;
}

export interface Report {
  _id: string;
  reportDetails: string;
  reportReason: string;
  message: string;
  author: string;
  topic: string;
  post: string;
  timestamp: Date;
}

export interface Post {
  _id: string;
  title: string;
  message: Message;
  author: string;
  messages: Message[]
  timestamp: string;
  latestPost: Date;
  locked?: boolean;
}
export interface PostPlain {
  _id: string;
  title: string;
  message: MessageWithoutReplies;
  author: string;
  messages: MessageWithoutReplies[];
  timestamp: string;
  latestPost: Date;
  uniques: number;
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
  deleted?: {
    timestamp?: Date;
    isDeleted?: boolean;
  };
  userId: number;
}

export type MessageWithoutReplies = Omit<Message, 'replies'>;