import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession } from '../types';

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string, remember?: boolean) => { success: boolean; error?: string };
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'edunexa_auth_session_v1';

const DEMO_CREDENTIALS = {
  email: 'superadmin@edunexa.demo',
  password: 'Demo@123'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Pre-fill or start logged in with Super Admin for seamless demo experience
        const defaultUser: UserSession = {
          email: DEMO_CREDENTIALS.email,
          name: 'Super Administrator',
          role: 'Global Platform Admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          isAuthenticated: true,
          loginTime: new Date().toISOString()
        };
        setUser(defaultUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUser));
      }
    } catch (e) {
      console.warn('Error reading auth session from storage', e);
    }
  }, []);

  const login = (email: string, pass: string, remember = true) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check credentials (mock authentication for demo)
    if (cleanEmail === DEMO_CREDENTIALS.email.toLowerCase() && pass === DEMO_CREDENTIALS.password) {
      const sessionUser: UserSession = {
        email: DEMO_CREDENTIALS.email,
        name: 'Super Administrator',
        role: 'Global Platform Admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        isAuthenticated: true,
        loginTime: new Date().toISOString()
      };
      setUser(sessionUser);
      if (remember) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
      }
      return { success: true };
    }

    return { 
      success: false, 
      error: 'Invalid credentials. Please use demo credentials: superadmin@edunexa.demo / Demo@123' 
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user?.isAuthenticated, login, logout }}>
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
