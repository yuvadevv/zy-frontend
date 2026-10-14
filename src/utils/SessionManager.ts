import { getSupabaseConfig } from '@/lib/utils/envValidator';
import { syncSupabaseSession, createClient } from '@/lib/supabase/client';

export interface AuthUser {
  id: string;
  email?: string;
  role?: string;
  user_metadata?: Record<string, any>;
  [key: string]: any;
}

function parseJwtPayload(token: string): any | null {
  try {
    if (!token) return null;
    const cleanToken = decodeURIComponent(token).replace(/^Bearer\s+/i, '').trim();
    const parts = cleanToken.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
    const raw = atob(padded);
    const bytes = Uint8Array.from(raw, (c) => c.charCodeAt(0));
    const jsonStr = new TextDecoder().decode(bytes);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

let isRefreshingPromise: Promise<{ token: string | null; user: AuthUser | null }> | null = null;

export const SessionManager = {
  setSession: async (token: string, user?: AuthUser | null, refreshToken?: string | null) => {
    if (typeof window === 'undefined') return;
    try {
      if (token) {
        localStorage.setItem('bl_session_token', token);
      }
      if (refreshToken) {
        localStorage.setItem('bl_session_refresh_token', refreshToken);
      }
      if (user) {
        localStorage.setItem('bl_session_user', JSON.stringify(user));
      }

      // Immediate client cookie for standalone PWA / WebAPK & Safari ITP reliability
      const isHttps = window.location.protocol === 'https:';
      const secureFlag = isHttps ? '; Secure' : '';
      if (token) {
        document.cookie = `bl_auth_token=${encodeURIComponent(token)}; path=/; max-age=2592000; SameSite=Lax${secureFlag}`;
      }
      if (refreshToken) {
        document.cookie = `bl_refresh_token=${encodeURIComponent(refreshToken)}; path=/; max-age=2592000; SameSite=Lax${secureFlag}`;
      }

      // Also sync session with Supabase browser client
      if (token && refreshToken) {
        syncSupabaseSession(token, refreshToken).catch(() => {});
      }

      // Persist HttpOnly cookies via server route
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, refreshToken })
      }).catch((e) => console.warn('Server session cookie sync warning:', e));

      // Notify any listeners within the current window/tab
      window.dispatchEvent(new CustomEvent('auth:session_updated'));
    } catch (e) {
      console.warn('Failed to save session to storage', e);
    }
  },

  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem('bl_session_token');
    } catch {
      return null;
    }
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('bl_session_refresh_token');
      if (stored) return stored;
      // Fallback: check document.cookie
      const match = document.cookie.match(/(?:^|;\s*)bl_refresh_token=([^;]+)/);
      return match ? decodeURIComponent(match[1]) : null;
    } catch {
      return null;
    }
  },

  getUser: (): AuthUser | null => {
    if (typeof window === 'undefined') return null;
    try {
      const u = localStorage.getItem('bl_session_user');
      if (u) return JSON.parse(u);
      // Fallback: derive user from access token payload
      const token = SessionManager.getToken();
      if (token) {
        const payload = parseJwtPayload(token);
        if (payload?.sub) {
          return {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
            user_metadata: payload.user_metadata || {},
            ...payload
          };
        }
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Checks if current access token is expired or within bufferSeconds of expiry.
   */
  isExpired: (tokenOrBuffer?: string | number, maybeBuffer = 60): boolean => {
    let token: string | null = null;
    let bufferSeconds = 60;
    if (typeof tokenOrBuffer === 'string') {
      token = tokenOrBuffer;
      bufferSeconds = maybeBuffer;
    } else if (typeof tokenOrBuffer === 'number') {
      bufferSeconds = tokenOrBuffer;
      token = SessionManager.getToken();
    } else {
      token = SessionManager.getToken();
    }
    if (!token) return true;
    const payload = parseJwtPayload(token);
    if (!payload?.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return now >= payload.exp - bufferSeconds;
  },

  /**
   * Refreshes the session using the stored refresh_token.
   * Debounced so concurrent callers share a single in-flight refresh promise.
   */
  refreshSession: async (): Promise<{ token: string | null; user: AuthUser | null }> => {
    if (typeof window === 'undefined') return { token: null, user: null };

    if (isRefreshingPromise) {
      return isRefreshingPromise;
    }

    isRefreshingPromise = (async () => {
      try {
        const refreshToken = SessionManager.getRefreshToken();
        if (!refreshToken) {
          return { token: null, user: null };
        }

        const config = getSupabaseConfig();
        const url = `${config.url}/auth/v1/token?grant_type=refresh_token`;

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'apikey': config.anonKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refresh_token: refreshToken })
        });

        const data = await res.json().catch(() => null);

        if (!res.ok || !data || data.error || !data.access_token) {
          // If rejected with 400/401 (invalid/revoked refresh token), clear local session
          if (res.status === 400 || res.status === 401) {
            console.warn('Session refresh rejected by Supabase Auth, clearing stale session');
            await SessionManager.clearSession();
          }
          return { token: null, user: null };
        }

        const newAccessToken = data.access_token;
        const newRefreshToken = data.refresh_token || refreshToken;
        const currentUser = data.user || SessionManager.getUser();

        await SessionManager.setSession(newAccessToken, currentUser, newRefreshToken);
        return { token: newAccessToken, user: currentUser };
      } catch (err) {
        // Network errors or offline mode — do NOT clear session!
        console.warn('Network error during session refresh, keeping existing local tokens', err);
        return { token: SessionManager.getToken(), user: SessionManager.getUser() };
      } finally {
        isRefreshingPromise = null;
      }
    })();

    return isRefreshingPromise;
  },

  /**
   * Returns a valid access token. If expired, proactively refreshes it first.
   */
  getValidToken: async (): Promise<string | null> => {
    const token = SessionManager.getToken();
    if (!token) return null;

    if (SessionManager.isExpired(90)) {
      const refreshed = await SessionManager.refreshSession();
      return refreshed.token || token;
    }

    return token;
  },

  clearSession: async () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('bl_session_token');
      localStorage.removeItem('bl_session_refresh_token');
      localStorage.removeItem('bl_session_user');

      // Clear client cookies directly
      document.cookie = 'bl_auth_token=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'bl_refresh_token=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'bl_profile_completed=; path=/; max-age=0; SameSite=Lax';

      // Clear HttpOnly cookies via server route
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clear: true })
      }).catch(() => {});

      // Sign out from Supabase client
      try {
        const supabase = createClient();
        await supabase.auth.signOut().catch(() => {});
      } catch {}

      window.dispatchEvent(new CustomEvent('auth:logout'));
    } catch (e) {
      console.warn('Failed to clear session', e);
    }
  },

  // Backward compatibility
  saveSession: (token: string, refreshToken?: string) => SessionManager.setSession(token, undefined, refreshToken),
  getSession: () => SessionManager.getToken(),
  removeSession: () => SessionManager.clearSession(),
};