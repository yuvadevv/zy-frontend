// src/lib/supabase/client.ts
// Direct Supabase client calls are deprecated. All requests route through zy-backend worker.
import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseConfig } from '../utils/envValidator';

export const createClient = () => {
  const config = getSupabaseConfig();
  const url = config.url || 'https://placeholder.supabase.co';
  const anonKey = config.anonKey || 'placeholder-anon-key';
  return createBrowserClient(url, anonKey);
};
