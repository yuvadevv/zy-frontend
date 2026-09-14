// src/utils/authHashHandler.ts
import { SessionManager, AuthUser } from './SessionManager';

export interface OAuthHashResult {
  handled: boolean;
  error?: string | null;
  user?: AuthUser | null;
  token?: string | null;
}

/**
 * Parses Supabase OAuth tokens from window.location.hash (Implicit Grant Flow)
 * and initializes the session in SessionManager and cookies.
 */
export async function handleOAuthHashRedirect(): Promise<OAuthHashResult> {
  if (typeof window === 'undefined') return { handled: false };
  const hash = window.location.hash;
  if (!hash) return { handled: false };

  // Check for error parameters in hash
  if (hash.includes('error=') || hash.includes('error_description=')) {
    const params = new URLSearchParams(hash.replace(/^#/, ''));
    const errorMsg = params.get('error_description') || params.get('error') || 'OAuth authentication failed';
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    return { handled: true, error: decodeURIComponent(errorMsg) };
  }

  // Check for access_token in hash
  if (hash.includes('access_token=')) {
    try {
      const params = new URLSearchParams(hash.replace(/^#/, ''));
      const token = params.get('access_token');
      if (!token) return { handled: false };

      // Decode JWT payload to get user details
      let user: AuthUser | null = null;
      const cleanToken = token.trim();
      const parts = cleanToken.split('.');
      if (parts.length >= 2) {
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const pad = base64.length % 4;
        const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
        const raw = atob(padded);
        const bytes = Uint8Array.from(raw, (c) => c.charCodeAt(0));
        const jsonStr = new TextDecoder().decode(bytes);
        const parsed = JSON.parse(jsonStr);

        user = {
          id: parsed.sub,
          email: parsed.email,
          role: parsed.role,
          user_metadata: parsed.user_metadata || {},
          ...parsed
        };
      }

      // Save token and user into SessionManager (localStorage & cookie)
      SessionManager.setSession(token, user);

      // Check if this is a password recovery flow
      const type = params.get('type');
      if (type === 'recovery') {
        window.history.replaceState(null, '', window.location.pathname);
        window.location.href = '/update-password';
        return { handled: true, token, user };
      }

      // Determine redirect destination
      const cookieMatch = document.cookie.match(/(?:^|;\s*)portal_next=([^;]+)/);
      const targetNext = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
      document.cookie = 'portal_next=; path=/; max-age=0; SameSite=Lax';

      const searchParams = new URLSearchParams(window.location.search);
      const paramNext = searchParams.get('next');

      let finalNext = targetNext || paramNext || '/app/home';
      // Sanity check destination
      if (!finalNext.startsWith('/app') && !finalNext.startsWith('/admin') && !finalNext.startsWith('/vendor')) {
        finalNext = '/app/home';
      }

      // Check if profile is completed
      try {
        const WORKER_URL = (process.env.NEXT_PUBLIC_WORKER_URL || 'http://127.0.0.1:8787').replace('127.0.0.1', 'localhost');
        const res = await fetch(`${WORKER_URL}/api/students/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data?.student?.name) {
          document.cookie = 'bl_profile_completed=true; path=/; max-age=2592000; SameSite=Lax';
        }
      } catch (e) {
        console.warn('Failed to check profile completion during OAuth hash handling:', e);
      }

      // Clean URL hash so the sensitive token doesn't stay in the browser address bar or history
      window.history.replaceState(null, '', window.location.pathname);

      // Navigate to destination
      window.location.href = finalNext;
      return { handled: true, token, user };
    } catch (e: any) {
      console.error('Failed to parse OAuth hash token:', e);
      return { handled: true, error: e.message || 'Failed to parse authentication tokens' };
    }
  }

  return { handled: false };
}
