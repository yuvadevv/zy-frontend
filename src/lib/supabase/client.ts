// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseConfig } from '../utils/envValidator';

export const createClient = () => {
  const config = getSupabaseConfig();
  return createBrowserClient(config.url, config.anonKey);
};
