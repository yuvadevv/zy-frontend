export interface AuthUser {
  id: string;
  email?: string;
  role?: string;
  user_metadata?: Record<string, any>;
  [key: string]: any;
}

export const SessionManager = {
  setSession: async (token: string, user?: AuthUser | null) => {
    if (typeof window === 'undefined') return;
    try {
      if (token) {
        localStorage.setItem('bl_session_token', token);
      }
      if (user) {
        localStorage.setItem('bl_session_user', JSON.stringify(user));
      }
      // Also set HttpOnly cookie via Next.js API for SSR/middleware use
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
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

  getUser: (): AuthUser | null => {
    if (typeof window === 'undefined') return null;
    try {
      const u = localStorage.getItem('bl_session_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  clearSession: async () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('bl_session_token');
      localStorage.removeItem('bl_session_user');
      // Clear HttpOnly auth token via server route
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clear: true })
      });
      // Also clear profile-completion cookie so next user gets proper onboarding
      document.cookie = 'bl_profile_completed=; path=/; max-age=0; SameSite=Lax';

      window.dispatchEvent(new CustomEvent('auth:logout'));
      // Do NOT redirect here — let the caller handle navigation to avoid race conditions
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