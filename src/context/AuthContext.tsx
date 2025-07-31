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
  logout: () => void;
  setPersistUser: (persist: boolean) => void;
  persistUser: boolean;
}

// ==================
// 🧠 Demo Users (fake DB)
// ==================
const DEMO_USERS: { username: string; password: string; role: UserRole }[] = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'user', password: 'user123', role: 'user' },
  { username: 'arbersadriu', password: 'user12', role: 'user' },
];

// ==================
// 🧱 Storage Keys
// ==================
const LOCAL_STORAGE_KEY = 'admin-dashboard-user';
const LOCAL_STORAGE_PERSIST_KEY = 'admin-dashboard-persist';

// ==================
// 🏪 Zustand Store
// ==================
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

// ==================
// 🌍 Create Context
// ==================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==================
// ✅ Auth Provider
// ==================
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser, persistUser, setPersistUser } = useAuthStore();

  // Restore auth state on mount
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

  // ------------------
  // 🔐 Login Function
  // ------------------
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

  // ------------------
  // 🚪 Logout Function
  // ------------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    sessionStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, setPersistUser, persistUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ==================
// 🎣 Custom Hook
// ==================
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};