import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { UserRecord } from '../types/index';

interface UserContextType {
  user: UserRecord | null;
  setUser: (user: UserRecord) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserRecord | null>(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? (JSON.parse(stored) as UserRecord) : null;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });

  const handleSetUser = (newUser: UserRecord) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const handleClearUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, setUser: handleSetUser, clearUser: handleClearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
