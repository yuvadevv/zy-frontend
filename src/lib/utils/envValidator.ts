// src/lib/utils/envValidator.ts

export const requireEnvVar = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const getSupabaseConfig = () => {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  };
};

export const getWorkerConfig = () => {
  return {
    workerUrl: process.env.NEXT_PUBLIC_WORKER_URL || 'http://127.0.0.1:8787'
  };
};
