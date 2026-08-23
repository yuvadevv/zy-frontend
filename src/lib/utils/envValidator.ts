// src/lib/utils/envValidator.ts

export const requireEnvVar = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const getSupabaseConfig = () => {
  return {
    // Next.js requires static references to process.env.NEXT_PUBLIC_* to inline them on the client
    url: requireEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: requireEnvVar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '', // Optional on client, required on server scripts
  };
};
