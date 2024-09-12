export const isElementInViewport = (id: string, document: Document): boolean => {
  const element = document.getElementById(id);
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