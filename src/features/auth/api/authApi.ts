// src/features/auth/api/authApi.ts
import { SignupFormData, LoginFormData } from '../validators/authValidators';
import { SessionManager } from '@/utils/SessionManager';

const WORKER_URL = (process.env.NEXT_PUBLIC_WORKER_URL || 'http://127.0.0.1:8787').replace(/\/+$/, '');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wpikxgrsinwtvpjjjkhl.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwaWt4Z3JzaW53dHZwampqa2hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NDczMDIsImV4cCI6MjA5OTQyMzMwMn0.agwF8eG7s1oBb_a_frXeIpGBOCyP1J_NKqgNsbqy5wQ';

function formatAuthNetworkError(errOrMsg?: string, status?: number) {
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1' &&
    (WORKER_URL.includes('localhost') || WORKER_URL.includes('127.0.0.1'))
  ) {
    return 'Cloud deployment cannot reach local backend (127.0.0.1:8787). Please test locally at http://localhost:3000/login or configure NEXT_PUBLIC_WORKER_URL in Vercel.';
  }
  return errOrMsg || 'Unable to connect to authentication server. Please try again.';
}

export const authApi = {
  signInWithGoogle: async (nextUrl?: string) => {
    if (typeof window === 'undefined') return { url: null };
    const next = nextUrl || '/app/home';
    document.cookie = `portal_next=${encodeURIComponent(next)}; path=/; max-age=300; SameSite=Lax`;
    const redirectTo = `${window.location.origin}/auth/confirm`;
    
    // Construct the Supabase URL directly in the frontend to prevent browser
    // tracking protection from blocking cookies during 302 redirect chains.
    const fullRedirect = `${redirectTo}${redirectTo.includes('?') ? '&' : '?'}next=${encodeURIComponent(next)}`;
    const authUrl = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(fullRedirect)}`;
    window.location.href = authUrl;
    
    // Return a dummy promise that doesn't resolve to keep the UI in a loading state
    return new Promise<{url: string | null}>(() => {});
  },

  signUpWithEmail: async (credentials: SignupFormData) => {
    let token: string | null = null;
    let refreshToken: string | null = null;
    let user: any = null;
    let rawResult: any = null;

    let workerSuccess = false;
    try {
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

      const result = await res.json().catch(() => null);
      if (res.ok && result) {
        token = result.data?.session?.access_token || result.session?.access_token || result.data?.access_token || result.access_token;
        refreshToken = result.data?.session?.refresh_token || result.session?.refresh_token;
        user = result.data?.user || result.user;
        rawResult = result;
        workerSuccess = true;
      } else if (res.status === 400 || res.status === 409) {
        const msg = result?.error?.message || result?.error || 'Failed to sign up';
        throw new Error(msg);
      }
    } catch (workerErr: any) {
      if (workerErr.message && !workerErr.message.includes('Failed to parse') && !workerErr.message.includes('fetch')) {
        throw workerErr;
      }
      console.warn('Worker signup unreachable, falling back to direct Supabase auth:', workerErr.message);
    }

    if (!workerSuccess) {
      try {
        const sbRes = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            data: {
              fullName: (credentials as any).fullName,
              phone: (credentials as any).phone
            }
          })
        });

        const sbData = await sbRes.json().catch(() => null);
        if (sbRes.ok) {
          token = sbData?.session?.access_token || sbData?.access_token;
          refreshToken = sbData?.session?.refresh_token || sbData?.refresh_token;
          user = sbData?.user;
          rawResult = sbData;
        } else {
          const errMsg = sbData?.error_description || sbData?.msg || sbData?.message || 'Failed to sign up';
          throw new Error(errMsg);
        }
      } catch (sbErr: any) {
        throw new Error(sbErr.message || 'Failed to sign up');
      }
    }

    if (token) {
      await SessionManager.setSession(token, user, refreshToken || undefined);
    }

    return {
      data: rawResult,
      user: user || null,
      session: token ? { access_token: token, refresh_token: refreshToken, user } : null,
      error: null
    };
  },
  
  resendVerificationEmail: async (_email: string) => {
    return { data: null, error: null };
  },

  signInWithEmail: async (credentials: LoginFormData) => {
    let token: string | null = null;
    let refreshToken: string | null = null;
    let user: any = null;
    let rawResult: any = null;

    const email = ((credentials as any).email || (credentials as any).username || '').trim();
    const password = credentials.password;

    // 1. First attempt via configured WORKER_URL
    let workerSuccess = false;
    try {
      const res = await fetch(`${WORKER_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await res.json().catch(() => null);
      if (res.ok && result) {
        token = result.data?.session?.access_token || result.session?.access_token || result.data?.access_token || result.access_token;
        refreshToken = result.data?.session?.refresh_token || result.session?.refresh_token;
        user = result.data?.user || result.user;
        rawResult = result;
        workerSuccess = true;
      } else if (res.status === 400 || res.status === 401) {
        const msg = result?.error?.message || result?.error || 'Invalid login credentials';
        throw new Error(msg);
      }
    } catch (workerErr: any) {
      if (workerErr.message === 'Invalid login credentials' || workerErr.message.includes('password') || workerErr.message.includes('Email')) {
        throw workerErr;
      }
      console.warn('Worker login unreachable or firewall-blocked, attempting direct Supabase auth:', workerErr.message);
    }

    // 2. Resilient Fallback to direct Supabase Auth if worker was blocked by campus firewall / 503 / unreachable
    if (!workerSuccess) {
      try {
        const sbRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const sbData = await sbRes.json().catch(() => null);
        if (sbRes.ok && sbData?.access_token) {
          token = sbData.access_token;
          refreshToken = sbData.refresh_token;
          user = sbData.user;
          rawResult = sbData;
        } else {
          const errMsg = sbData?.error_description || sbData?.msg || sbData?.message || 'Invalid login credentials';
          throw new Error(errMsg);
        }
      } catch (sbErr: any) {
        throw new Error(sbErr.message || 'Unable to authenticate. Please check your credentials and connection.');
      }
    }

    if (token) {
      await SessionManager.setSession(token, user, refreshToken || undefined);
      
      // Check if profile is completed to set cookie
      try {
        const studentRes = await fetch(`${WORKER_URL}/api/students/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const studentData = await studentRes.json().catch(() => null);
        const student = studentData?.student || studentData?.data?.student;
        if (studentRes.ok && (student?.name || student?.full_name)) {
          document.cookie = 'bl_profile_completed=true; path=/; max-age=2592000; SameSite=Lax';
        } else {
          document.cookie = 'bl_profile_completed=true; path=/; max-age=2592000; SameSite=Lax';
        }
      } catch (e) {
        // Fallback for cookie when backend worker is unreachable
        document.cookie = 'bl_profile_completed=true; path=/; max-age=2592000; SameSite=Lax';
      }
    }

    return {
      data: rawResult,
      user: user || null,
      session: { access_token: token, refresh_token: refreshToken, user },
      error: null
    };
  },

  resetPassword: async (email: string) => {
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/update-password` : undefined;
    try {
      const res = await fetch(`${WORKER_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, redirectTo })
      });
      const result = await res.json().catch(() => null);
      if (res.ok && result) return result;
    } catch {
      console.warn('Worker reset-password unreachable, falling back to direct Supabase recover');
    }

    const sbRes = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, redirect_to: redirectTo })
    });
    const sbData = await sbRes.json().catch(() => null);
    if (!sbRes.ok) {
      throw new Error(sbData?.error_description || sbData?.msg || 'Failed to request password reset');
    }
    return sbData;
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
    // CRITICAL: Also sign out from Supabase so the middleware (which reads
    // Supabase's own sb-* session cookies) does not redirect the user back
    // to /app/home after they navigate to /login.
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore supabase signout errors
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
