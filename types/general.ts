export interface PostProps {
  title?: string;
  message: string;
  topic: TopicType
}
export interface CreatePostProps {
  topics: TopicType[]  
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
  content: string;
  author: string;
  timestamp: Date;
  replies: Message[];
}

export interface Post {
  id: string;
  title: string;
  message: string;
  author: string;
  messages: any[];
  timestamp: Date;
}
export interface TopicSummary {
  name: string,
  posts: PostSummary[]
}
export interface PostSummary {
  id: string;
  title: string;
  message: string;
  author: string;
  messagesCount: number;
  timestamp: Date;
}
