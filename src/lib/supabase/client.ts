// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseConfig } from '../utils/envValidator';

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export const createClient = () => {
  if (typeof window !== 'undefined' && browserClient) {
    return browserClient;
  }

  const config = getSupabaseConfig();
  const url = config.url || 'https://placeholder.supabase.co';
  const anonKey = config.anonKey || 'placeholder-anon-key';

  const client = createBrowserClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  if (typeof window !== 'undefined') {
    browserClient = client;
  }

  return client;
};

let isSyncingToSupabase = false;

export function isCurrentlySyncingSupabase(): boolean {
  return isSyncingToSupabase;
}

/**
 * Synchronize access and refresh tokens into the Supabase browser client
 * so that Supabase's native auto-refresh loop and auth state machine remain active.
 */
export async function syncSupabaseSession(accessToken: string, refreshToken?: string | null) {
  if (typeof window === 'undefined' || !accessToken || !refreshToken) return;
  try {
    const supabase = createClient();
    
    // Prevent duplicate sets if Supabase already holds this session
    const { data } = await supabase.auth.getSession().catch(() => ({ data: { session: null } }));
    if (data?.session?.access_token === accessToken) {
      return;
    }

    isSyncingToSupabase = true;
    try {
      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    } finally {
      // Keep guard active briefly to ensure any immediate onAuthStateChange event is ignored
      setTimeout(() => {
        isSyncingToSupabase = false;
      }, 150);
    }
  } catch (err) {
    isSyncingToSupabase = false;
    console.warn('Failed to sync session with Supabase client:', err);
  }
}
