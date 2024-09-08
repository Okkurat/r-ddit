import { Message, Post } from './types';

export const findMessageIndex = (message_id: string, post: Post): number => {
  const index = post.messages.findIndex((message: Message) => message._id === message_id);
  if(index === -1){
    return 0;
  }
  return index;
};

export const isElementInViewport = (message_id: string, document: Document): boolean => {
  const element = document.getElementById(message_id);
  if (element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  return false;
};

export const scrollToMessage = (messageId: string): void => {
  if (!isElementInViewport(messageId, document)) {
    const element = document.getElementById(messageId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
};