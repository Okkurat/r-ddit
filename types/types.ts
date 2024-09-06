import { Types } from "mongoose";

export interface PostProps {
  title?: string;
  message: string;
  topic: TopicType
}
export interface TopicType {
  name: string
}
export interface NewPostData {
  message: string;
  author: string;
  title?: string;
}

export interface Message {
  author: any;
  _id: string;
  timestamp: string;
  content: string;
  replies: Reply[]
}
export interface Reply {
  id: string;
  content: string
}

export interface PostData {
  message: string;
  author: string;
  title?: string;
}
export interface MessageData {
  content: string;
  author: string;
}

export interface Post {
  id?: string;
  title: string;
  message: Message;
  author: string;
  messages: Message[];
  timestamp: string;
}

export interface TopicSummary {
  id: string;
  name: string;
  posts: PostSummary[]
}

export interface PostSummary {
  id: string;
  title: string;
  message: MessageSummary;
  author: string;
  messages: Message[]
  timestamp: string
}

export interface MessageSummary {
  content: string;
  author: string;
}

export interface PopulatedPost {
  _id: Types.ObjectId;
  title: string;
  message: {
    content: string;
    author: string;
  };
  author: string;
  messages: Message[];
  timestamp: Date;
}

export interface PopulatedTopic {
  _id: Types.ObjectId;
  name: string;
  posts: PopulatedPost[];
}