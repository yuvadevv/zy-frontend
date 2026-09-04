// src/lib/supabase/server.ts
// Direct Supabase calls are deprecated. All requests route through zy-backend worker.
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseConfig } from '../utils/envValidator';

export const createClient = async () => {
  const cookieStore = await cookies();
  const config = getSupabaseConfig();
  const url = config.url || 'https://placeholder.supabase.co';
  const anonKey = config.anonKey || 'placeholder-anon-key';

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch { }
      },
    },
  });
};
