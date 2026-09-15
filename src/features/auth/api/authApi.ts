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
    
    // Construct the Supabase URL directly in the frontend to prevent browser
    // tracking protection from blocking cookies during 302 redirect chains.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wpikxgrsinwtvpjjjkhl.supabase.co';
    
    const fullRedirect = `${redirectTo}${redirectTo.includes('?') ? '&' : '?'}next=${encodeURIComponent(next)}`;
    const authUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(fullRedirect)}&response_type=token`;
    window.location.href = authUrl;
    
    // Return a dummy promise that doesn't resolve to keep the UI in a loading state
    return new Promise<{url: string | null}>(() => {});
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
      await SessionManager.setSession(token, user);
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
      await SessionManager.setSession(token, user);
      
      // Check if profile is completed to set cookie
      try {
        const studentRes = await fetch(`${WORKER_URL}/api/students/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const studentData = await studentRes.json();
        if (studentRes.ok && studentData?.student?.name) {
          document.cookie = 'bl_profile_completed=true; path=/; max-age=2592000; SameSite=Lax';
        }
      } catch (e) {
        console.warn('Failed to check profile completion on login', e);
      }
    }

    return {
      data: result.data || result,
      user: user || null,
      session: result.data?.session || result.session || null,
      error: null
    };
  },

  resetPassword: async (email: string) => {
    const res = await fetch(`${WORKER_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const result = await res.json().catch(() => ({ error: 'Failed to parse response' }));
    if (!res.ok) {
      throw new Error(result.error?.message || result.error || 'Failed to request password reset');
    }
    return result;
  },

  updatePassword: async (password: string) => {
    const token = SessionManager.getToken();
    if (!token) throw new Error("No active session found for password reset");

    const res = await fetch(`${WORKER_URL}/api/auth/update-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, access_token: token })
    });
    const result = await res.json().catch(() => ({ error: 'Failed to parse response' }));
    if (!res.ok) {
      throw new Error(result.error?.message || result.error || 'Failed to update password');
    }
    return result;
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
    await SessionManager.clearSession();
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
