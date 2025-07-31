import {createContext, useContext, useEffect, type ReactNode} from 'react';
import { create } from 'zustand';

export type UserRole = 'admin' | 'user';

export interface User {
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setPersistUser: (persist: boolean) => void;
  persistUser: boolean;
}

let DEMO_USERS: { username: string; password: string; role: UserRole }[] = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'user', password: 'user123', role: 'user' },
  { username: 'arbersadriu', password: 'user12', role: 'user' },
];

const loadUsersFromStorage = () => {
  try {
    const stored = localStorage.getItem('admin-dashboard-users');
    if (stored) {
      DEMO_USERS = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load users from storage:', error);
  }
};

const saveUsersToStorage = (users: typeof DEMO_USERS) => {
  try {
    localStorage.setItem('admin-dashboard-users', JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save users to storage:', error);
  }
};

loadUsersFromStorage();

const LOCAL_STORAGE_KEY = 'admin-dashboard-user';
const LOCAL_STORAGE_PERSIST_KEY = 'admin-dashboard-persist';

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
  persistUser: boolean;
  setPersistUser: (persist: boolean) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  persistUser: false,
  setPersistUser: (persist) => {
    set({ persistUser: persist });
    localStorage.setItem(LOCAL_STORAGE_PERSIST_KEY, JSON.stringify(persist));

    if (!persist) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  },
}));

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser, persistUser, setPersistUser } = useAuthStore();

  useEffect(() => {
    try {
      const storedPersist = localStorage.getItem(LOCAL_STORAGE_PERSIST_KEY);
      const persist = storedPersist ? JSON.parse(storedPersist) : false;

      setPersistUser(persist);

      const storage = persist ? localStorage : sessionStorage;
      const storedUser = storage.getItem(LOCAL_STORAGE_KEY);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to load auth data from storage.', error);
    }
  }, [setUser, setPersistUser]);

  const login = async (username: string, password: string): Promise<boolean> => {
    const matchedUser = DEMO_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (matchedUser) {
      const userObj: User = {
        username: matchedUser.username,
        role: matchedUser.role,
      };

      setUser(userObj);

      const storage = persistUser ? localStorage : sessionStorage;
      storage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userObj));

      return true;
    }

    return false;
  };

  const register = async (username: string, password: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
    const existingUser = DEMO_USERS.find(u => u.username === username);
    if (existingUser) {
      return { success: false, error: 'Username already exists' };
    }

    if (username.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    const newUser = { username, password, role };
    DEMO_USERS.push(newUser);
    saveUsersToStorage(DEMO_USERS);

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    sessionStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, setPersistUser, persistUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};