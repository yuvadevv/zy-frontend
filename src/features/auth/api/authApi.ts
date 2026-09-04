// src/features/auth/api/authApi.ts
import { SignupFormData, LoginFormData } from '../validators/authValidators';
import { SessionManager } from '@/utils/SessionManager';

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'http://127.0.0.1:8787';

export const authApi = {
  signInWithGoogle: async (nextUrl?: string) => {
    if (typeof window === 'undefined') return { url: null };
    const next = nextUrl || '/app/home';
    document.cookie = `portal_next=${encodeURIComponent(next)}; path=/; max-age=300; SameSite=Lax`;
    const redirectTo = `${window.location.origin}/auth/confirm`;
    const oauthUrl = `${WORKER_URL}/api/auth/oauth/google?redirect_to=${encodeURIComponent(redirectTo)}&next=${encodeURIComponent(next)}`;
    window.location.href = oauthUrl;
    return { url: oauthUrl };
  },

  signUpWithEmail: async (credentials: SignupFormData) => {
    const res = await fetch(`${WORKER_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        data: {
          fullName: (credentials as any).fullName,
          phone: (credentials as any).phone
        }
      })
    });

    const result = await res.json().catch(() => ({ error: 'Failed to parse response' }));
    if (!res.ok) {
      const msg = result.error?.message || result.error || 'Failed to sign up';
      throw new Error(msg);
    }

    const token = result.data?.session?.access_token || result.session?.access_token || result.data?.access_token || result.access_token;
    const user = result.data?.user || result.user;
    if (token) {
      SessionManager.setSession(token, user);
    }

    return {
      data: result.data || result,
      user: user || null,
      session: result.data?.session || result.session || null,
      error: null
    };
  },
  
  resendVerificationEmail: async (_email: string) => {
    return { data: null, error: null };
  },

  signInWithEmail: async (credentials: LoginFormData) => {
    const res = await fetch(`${WORKER_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: (credentials as any).email || (credentials as any).username,
        username: (credentials as any).username,
        password: credentials.password
      })
    });

    const result = await res.json().catch(() => ({ error: 'Failed to parse response' }));
    if (!res.ok) {
      const msg = result.error?.message || result.error || 'Invalid login credentials';
      throw new Error(msg);
    }

    const token = result.data?.session?.access_token || result.session?.access_token || result.data?.access_token || result.access_token;
    const user = result.data?.user || result.user;
    if (token) {
      SessionManager.setSession(token, user);
    }

    return {
      data: result.data || result,
      user: user || null,
      session: result.data?.session || result.session || null,
      error: null
    };
  },

  resetPassword: async (_email: string) => {
    return { data: null, error: null };
  },

  updatePassword: async (_password: string) => {
    return { data: null, error: null };
  },

  signOut: async () => {
    try {
      await fetch(`${WORKER_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch {
      // ignore network errors on logout
    }
    SessionManager.clearSession();
    return { error: null };
  },

  getSession: async () => {
    const token = SessionManager.getToken();
    const user = SessionManager.getUser();
    if (!token) {
      return { data: { session: null, user: null }, session: null, user: null, error: null };
    }
    const sessionObj = {
      access_token: token,
      token_type: 'bearer',
      user: user
    };
    return {
      data: {
        session: sessionObj,
        user: user
      },
      session: sessionObj,
      user: user,
      error: null
    };
  }
};
