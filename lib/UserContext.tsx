'use client';

import { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  user: string;
  setUser: (newUser: string) => void;
  isMod: boolean;
  setIsMod: (value: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string>('');
  const [isMod, setIsMod] = useState<boolean>(false);

  return (
    <UserContext.Provider value={{ user, setUser, isMod, setIsMod }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export const useUserValue = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserValue must be used within a UserProvider');
  }
  return context.user;
};

export const useUserSetter = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserSetter must be used within a UserProvider');
  }
  return context.setUser;
};

export const useIsMod = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useIsMod must be used within a UserProvider');
  }
  return context.isMod;
};

export const useSetIsMod = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useSetIsMod must be used within a UserProvider');
  }
  return context.setIsMod;
};