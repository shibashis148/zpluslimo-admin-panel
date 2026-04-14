import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('zpl_user');
    return stored ? JSON.parse(stored) : null;
  });

  const VALID_CREDENTIALS = [
    { email: 'tech@zpluslimo.com', password: '123456', name: 'Tech Admin', role: 'Super Admin' },
    { email: 'admin@zpluslimo.ae', password: 'admin123', name: 'Admin User', role: 'Admin' },
  ];

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 1200));
    const match = VALID_CREDENTIALS.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
    );
    if (match) {
      const u: User = {
        id: '1',
        name: match.name,
        email: match.email,
        role: match.role,
      };
      setUser(u);
      localStorage.setItem('zpl_user', JSON.stringify(u));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zpl_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
