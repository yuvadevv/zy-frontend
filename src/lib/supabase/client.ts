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

/**
 * Synchronize access and refresh tokens into the Supabase browser client
 * so that Supabase's native auto-refresh loop and auth state machine remain active.
 */
export async function syncSupabaseSession(accessToken: string, refreshToken?: string | null) {
  if (typeof window === 'undefined' || !accessToken) return;
  try {
    const supabase = createClient();
    if (refreshToken) {
      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    }
  } catch (err) {
    console.warn('Failed to sync session with Supabase client:', err);
  }
}
