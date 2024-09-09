'use client';

import { createContext, useContext, useState, ReactNode } from "react";

interface MessageContextType {
  value: string;
  setValue: (newValue: string) => void;
  isAllowed: string;
  setIsAllowed: (allowed: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [value, setValue] = useState<string>('');
  const [isAllowed, setIsAllowed] = useState<string>('');

  return (
    <MessageContext.Provider value={{ value, setValue, isAllowed, setIsAllowed }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessageContext must be used within a MessageProvider');
  }
  return context;
};

export const useMessageValue = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessageValue must be used within a MessageProvider");
  }
  return context.value;
};

export const useMessageSetter = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessageSetter must be used within a MessageProvider");
  }
  return context.setValue;
};

export const useIsAllowed = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useIsShow must be used within a MessageProvider");
  }
  return context.isAllowed;
};

export const useSetIsAllowed = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useSetIsShow must be used within a MessageProvider");
  }
  return context.setIsAllowed;
};
