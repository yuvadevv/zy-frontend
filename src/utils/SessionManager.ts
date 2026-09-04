export interface AuthUser {
  id: string;
  email?: string;
  role?: string;
  user_metadata?: Record<string, any>;
  [key: string]: any;
}

export const SessionManager = {
  setSession: (token: string, user?: AuthUser | null) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('bl_session_token', token);
      if (user) {
        localStorage.setItem('bl_session_user', JSON.stringify(user));
      }
      // Set cookie for Next.js middleware / server components
      document.cookie = `bl_auth_token=${encodeURIComponent(token)}; path=/; max-age=2592000; SameSite=Lax`;
    } catch (e) {
      console.warn('Failed to save session to storage', e);
    }
  },

  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      const local = localStorage.getItem('bl_session_token');
      if (local) return local;

      const match = document.cookie.match(/(?:^|;\s*)bl_auth_token=([^;]+)/);
      return match ? decodeURIComponent(match[1]) : null;
    } catch {
      return null;
    }
  },

  getUser: (): AuthUser | null => {
    if (typeof window === 'undefined') return null;
    try {
      const u = localStorage.getItem('bl_session_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  clearSession: () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('bl_session_token');
      localStorage.removeItem('bl_session_user');
      document.cookie = 'bl_auth_token=; path=/; max-age=0; SameSite=Lax';
    } catch (e) {
      console.warn('Failed to clear session', e);
    }
  },

  // Backward compatibility
  saveSession: (token: string) => SessionManager.setSession(token),
  getSession: () => SessionManager.getToken(),
  removeSession: () => SessionManager.clearSession(),
  isExpired: () => false
};