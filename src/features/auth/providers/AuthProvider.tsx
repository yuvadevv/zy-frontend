'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SessionManager, AuthUser } from '@/utils/SessionManager';

export interface AuthSession {
  access_token: string;
  token_type?: string;
  user?: AuthUser | null;
  [key: string]: any;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const token = SessionManager.getToken();
      const currentUser = SessionManager.getUser();

      if (token) {
        setSession({ access_token: token, user: currentUser });
        setUser(currentUser);
      } else {
        setSession(null);
        setUser(null);
      }
      setIsLoading(false);
    };

    initAuth();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'bl_session_token' || e.key === 'bl_session_user') {
        initAuth();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthSession = () => useContext(AuthContext);
