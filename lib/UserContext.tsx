'use client';

import { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  user: string;
  setUser: (newUser: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string>('');

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
