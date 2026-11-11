// src/lib/utils/envValidator.ts

export const requireEnvVar = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const getSupabaseConfig = () => {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wpikxgrsinwtvpjjjkhl.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwaWt4Z3JzaW53dHZwampqa2hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NDczMDIsImV4cCI6MjA5OTQyMzMwMn0.agwF8eG7s1oBb_a_frXeIpGBOCyP1J_NKqgNsbqy5wQ',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  };
};

export const getWorkerConfig = () => {
  return {
    workerUrl: process.env.NEXT_PUBLIC_WORKER_URL || 'http://127.0.0.1:8787'
  };
};
