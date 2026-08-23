// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseConfig } from '../utils/envValidator';

export const createClient = async () => {
  const cookieStore = await cookies();
  const config = getSupabaseConfig();

  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
};

export const createAdminClient = async () => {
  const config = getSupabaseConfig();
  if (!config.serviceRoleKey) {
    throw new Error('Service Role Key is missing. Cannot create admin client.');
  }
  
  return createServerClient(config.url, config.serviceRoleKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // Admin client usually does not set cookies
      },
    },
  });
};
