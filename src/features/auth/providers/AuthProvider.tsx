'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { SessionManager, AuthUser } from '@/utils/SessionManager';
import { handleOAuthHashRedirect } from '@/utils/authHashHandler';
import { createClient, syncSupabaseSession } from '@/lib/supabase/client';

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
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  refreshSession: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isInitializingRef = useRef(false);

  const initAuth = useCallback(async () => {
    if (isInitializingRef.current) return;
    isInitializingRef.current = true;

    try {
      let token = SessionManager.getToken();
      let refreshToken = SessionManager.getRefreshToken();
      let currentUser = SessionManager.getUser();

      if (token) {
        // If expired or about to expire in next 60s, attempt refresh
        if (SessionManager.isExpired(token, 60)) {
          if (refreshToken) {
            const refreshed = await SessionManager.refreshSession();
            if (refreshed.token) {
              token = refreshed.token;
              currentUser = refreshed.user || SessionManager.getUser();
            } else if (typeof navigator !== 'undefined' && !navigator.onLine) {
              // Network offline: retain session credentials, don't clear
              console.warn('Network offline while restoring session; retaining cached credentials');
            } else {
              token = null;
              currentUser = null;
            }
          } else {
            // Expired and no refresh token
            token = null;
            currentUser = null;
          }
        }
      } else if (refreshToken) {
        // Fallback: Access token was missing or cleared, but refresh token exists
        const refreshed = await SessionManager.refreshSession();
        if (refreshed.token) {
          token = refreshed.token;
          currentUser = refreshed.user || SessionManager.getUser();
        }
      }

      if (token) {
        setSession({ access_token: token, user: currentUser });
        setUser(currentUser);
        if (refreshToken) {
          syncSupabaseSession(token, refreshToken).catch(() => {});
        }
      } else {
        setSession(null);
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to initialize auth session:', err);
    } finally {
      setIsLoading(false);
      isInitializingRef.current = false;
    }
  }, []);

  useEffect(() => {
    // 1. Handle OAuth hash if present
    if (typeof window !== 'undefined' && window.location.hash.includes('access_token=')) {
      handleOAuthHashRedirect().then((res) => {
        if (!res.handled) {
          initAuth();
        }
      }).catch(() => initAuth());
      return;
    }

    // 2. Initial auth resolution
    initAuth();

    // 3. Listen to Supabase auth state change (e.g. background token refresh)
    let unsubscribeSupabase = () => {};
    try {
      const supabase = createClient();
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, newSession: any) => {
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
        } else if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
          if (newSession?.access_token) {
            const u: AuthUser | null = newSession.user ? {
              id: newSession.user.id,
              email: newSession.user.email,
              role: (newSession.user as any).role,
              user_metadata: newSession.user.user_metadata || {},
            } : SessionManager.getUser();

            await SessionManager.setSession(newSession.access_token, u, newSession.refresh_token);
            setSession({ access_token: newSession.access_token, user: u });
            setUser(u);
          }
        }
      });
      unsubscribeSupabase = () => subscription.unsubscribe();
    } catch (e) {
      console.warn('Failed to subscribe to Supabase auth state:', e);
    }

    // 4. Cross-tab and local session update listeners
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'bl_session_token' || e.key === 'bl_session_refresh_token' || e.key === 'bl_session_user') {
        initAuth();
      }
    };
    window.addEventListener('storage', handleStorage);

    const handleSessionUpdated = () => {
      const token = SessionManager.getToken();
      const currentUser = SessionManager.getUser();
      if (token) {
        setSession({ access_token: token, user: currentUser });
        setUser(currentUser);
      }
    };
    window.addEventListener('auth:session_updated', handleSessionUpdated);

    const handleLogoutEvent = () => {
      setSession(null);
      setUser(null);
      setIsLoading(false);
    };
    window.addEventListener('auth:logout', handleLogoutEvent);

    return () => {
      unsubscribeSupabase();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('auth:session_updated', handleSessionUpdated);
      window.removeEventListener('auth:logout', handleLogoutEvent);
    };
  }, [initAuth]);

  const refreshSession = useCallback(async () => {
    const refreshed = await SessionManager.refreshSession();
    if (refreshed.token) {
      setSession({ access_token: refreshed.token, user: refreshed.user });
      setUser(refreshed.user);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, isLoading, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthSession = () => useContext(AuthContext);
