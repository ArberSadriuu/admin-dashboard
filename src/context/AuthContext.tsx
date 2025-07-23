import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// User and Auth types
export type UserRole = 'admin' | 'user';
export interface User {
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded users for demo
const DEMO_USERS: { username: string; password: string; role: UserRole }[] = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'user', password: 'user123', role: 'user' },
  { username: 'arbersadriu', password: 'user12', role: 'user' },

];

const LOCAL_STORAGE_KEY = 'admin-dashboard-user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Restore user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const login = async (username: string, password: string) => {
    const found = DEMO_USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      const userObj = { username: found.username, role: found.role };
      setUser(userObj);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userObj));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 